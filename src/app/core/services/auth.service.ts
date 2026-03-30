import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
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
          plano: null
        });

        await this.syncBackendUser(user);
      } else {
        this.currentUser.set(null);
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
   * Espera o Firebase terminar de restaurar a sessão
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: name });

      this.toastr.success('Conta criada com sucesso!', 'Bem-vindo!');
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.toastr.success('Login realizado com sucesso!', 'Bem-vindo de volta!');
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  /**
   * Login com Google
   */
  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      await this.signInWithGooglePopup(provider);
      this.toastr.success('Login realizado com sucesso!', 'Bem-vindo!');
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  private signInWithGooglePopup(provider: GoogleAuthProvider): Promise<unknown> {
    return signInWithPopup(auth, provider);
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.toastr.info('Você saiu da conta', 'Até logo!');
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
      await sendPasswordResetEmail(auth, email);
      this.toastr.success('Email de recuperação enviado!', 'Verifique sua caixa de entrada');
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  /**
   * Pegar token JWT do usuário
   */
  async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  /**
   * Verificar se usuário está logado
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Tratamento de erros do Firebase
   */
  private handleAuthError(error: any): void {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operação não permitida',
      'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
      'auth/user-disabled': 'Usuário desabilitado',
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-credential': 'Credenciais inválidas',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/popup-closed-by-user': 'Login cancelado'
    };

    const message = errorMessages[error.code] || 'Erro ao realizar operação';
    this.toastr.error(message, 'Erro de Autenticação');
  }
}
