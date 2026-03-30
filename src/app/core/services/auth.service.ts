import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../../../../firebase-config';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';

export interface UserData {
  backendUserId?: number | null;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plano?: 'gratuito' | 'basic' | 'gold' | 'premium' | null;
  authProvider?: 'firebase' | 'backend';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private apiService = inject(ApiService);

  currentUser = signal<UserData | null>(null);
  isLoading = signal<boolean>(true);
  authInitialized = signal<boolean>(false);

  constructor() {
    this.initAuthListener();
  }

  /**
   * Listener do Firebase Auth
   */
  private initAuthListener(): void {
    auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        this.currentUser.set({
          backendUserId: null,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          plano: null,
          authProvider: 'firebase'
        });

        await this.syncBackendUser(user);
      } else {
        const cached = this.getBackendSession();
        if (cached) {
          this.currentUser.set(cached);
        } else {
          this.currentUser.set(null);
        }
      }

      this.isLoading.set(false);
      this.authInitialized.set(true);
    });
  }

  private async syncBackendUser(user: User): Promise<void> {
    try {
      const response = await firstValueFrom(this.apiService.syncAuth({
        nome: user.displayName,
        email: user.email,
        provedor_autenticacao: 'firebase',
        id_usuario_provedor: user.uid,
        foto_url: user.photoURL
      }));

      const current = this.currentUser();

      if (!current) return;

      this.currentUser.set({
        ...current,
        backendUserId: Number(response.usuario.id),
        plano: response.plano_atual?.slug ?? null
      });
    } catch (error) {
      console.error('Erro ao sincronizar usuario com o backend:', error);
    }
  }

  /**
   * Espera o Firebase terminar de restaurar a sessao
   */
  async waitForAuthInit(): Promise<void> {
    if (this.authInitialized()) return;

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.authInitialized()) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  /**
   * Registro com email e senha
   */
  async register(email: string, password: string, name: string): Promise<boolean> {
    try {
      await firstValueFrom(this.apiService.registerEmail({
        nome: name,
        email,
        senha: password
      }));

      this.toastr.success('Conta criada! Verifique seu email para confirmar.', 'Bem-vindo!');
      return true;
    } catch (error: any) {
      this.handleBackendError(error);
      return false;
    }
  }

  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.apiService.loginEmail({
        email,
        senha: password
      }));

      this.setBackendSession(response.token, response.usuario);
      this.toastr.success('Login realizado com sucesso!', 'Bem-vindo de volta!');
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.handleBackendError(error);
      return false;
    }
  }

  /**
   * Login com Google
   */
  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const mode = await this.signInWithGooglePopup(provider);

      if (mode === 'redirect') {
        this.toastr.info('Continuando login com Google...', 'Aguarde');
        return true;
      }

      this.toastr.success('Login realizado com sucesso!', 'Bem-vindo!');
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  private async signInWithGooglePopup(provider: GoogleAuthProvider): Promise<'popup' | 'redirect'> {
    try {
      await signInWithPopup(auth, provider);
      return 'popup';
    } catch (error: any) {
      const popupErrors = [
        'auth/popup-closed-by-user',
        'auth/popup-blocked',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment'
      ];

      if (popupErrors.includes(error?.code)) {
        await signInWithRedirect(auth, provider);
        return 'redirect';
      }

      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }

      this.clearBackendSession();
      this.currentUser.set(null);
      this.toastr.info('Voce saiu da conta', 'Ate logo!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.toastr.error('Erro ao sair', 'Tente novamente');
    }
  }

  /**
   * Resetar senha
   */
  async resetPassword(email: string): Promise<boolean> {
    try {
      await firstValueFrom(this.apiService.requestPasswordReset({ email }));
      this.toastr.success('Email de recuperacao enviado!', 'Verifique sua caixa de entrada');
      return true;
    } catch (error: any) {
      this.handleBackendError(error);
      return false;
    }
  }

  /**
   * Pegar token JWT do usuario
   */
  async getToken(): Promise<string | null> {
    return localStorage.getItem('nicol_auth_token');
  }

  /**
   * Verificar se usuario esta logado
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Tratamento de erros do Firebase
   */
  private handleAuthError(error: any): void {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este email ja esta em uso',
      'auth/invalid-email': 'Email invalido',
      'auth/operation-not-allowed': 'Operacao nao permitida',
      'auth/weak-password': 'Senha muito fraca (minimo 6 caracteres)',
      'auth/user-disabled': 'Usuario desabilitado',
      'auth/user-not-found': 'Usuario nao encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-credential': 'Credenciais invalidas',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde',
      'auth/network-request-failed': 'Erro de conexao. Verifique sua internet',
      'auth/popup-closed-by-user': 'Login cancelado',
      'auth/popup-blocked': 'Popup bloqueado. Vamos continuar em outra janela.',
      'auth/unauthorized-domain': 'Dominio nao autorizado no Firebase.'
    };

    const message = errorMessages[error.code] || 'Erro ao realizar operacao';
    this.toastr.error(message, 'Erro de Autenticacao');
  }

  private handleBackendError(error: any): void {
    const status = error?.status;
    const message = error?.error?.message;

    if (status && message) {
      const title = status === 403 ? 'Verificacao pendente' : 'Erro de Autenticacao';
      const type = status === 403 ? 'warning' : 'error';
      this.toastr[type](message, title);
      return;
    }

    this.toastr.error(message || 'Erro ao realizar operacao', 'Erro de Autenticacao');
  }

  private setBackendSession(token: string, usuario: {
    id: string;
    nome: string | null;
    email: string;
    provedor_autenticacao: string;
    id_usuario_provedor: string | null;
    foto_url: string | null;
    criado_em: string;
    atualizado_em: string;
  }): void {
    const userData: UserData = {
      backendUserId: Number(usuario.id),
      uid: `backend-${usuario.id}`,
      email: usuario.email,
      displayName: usuario.nome,
      photoURL: usuario.foto_url,
      plano: null,
      authProvider: 'backend'
    };

    localStorage.setItem('nicol_auth_token', token);
    localStorage.setItem('nicol_auth_user', JSON.stringify(userData));
    this.currentUser.set(userData);
  }

  private getBackendSession(): UserData | null {
    const raw = localStorage.getItem('nicol_auth_user');
    if (!raw) return null;

    try {
      return JSON.parse(raw) as UserData;
    } catch {
      return null;
    }
  }

  private clearBackendSession(): void {
    localStorage.removeItem('nicol_auth_token');
    localStorage.removeItem('nicol_auth_user');
  }
}
