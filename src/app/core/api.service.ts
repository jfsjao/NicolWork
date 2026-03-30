import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SyncAuthPayload {
  nome: string | null;
  email: string | null;
  provedor_autenticacao: string;
  id_usuario_provedor: string;
  foto_url: string | null;
}

export interface PlanoAtualResponse {
  id: string;
  slug: 'gratuito' | 'basic' | 'gold' | 'premium';
  nome: string;
  descricao?: string | null;
  preco?: string;
  status_usuario_plano?: string;
  iniciado_em?: string;
  expira_em?: string | null;
}

export interface SyncAuthResponse {
  message: string;
  primeiro_acesso: boolean;
  usuario: {
    id: string;
    nome: string | null;
    email: string;
    provedor_autenticacao: string;
    id_usuario_provedor: string | null;
    foto_url: string | null;
    criado_em: string;
    atualizado_em: string;
  };
  plano_atual: PlanoAtualResponse | null;
}

export interface PackResponse {
  id: number;
  slug: string;
  nome: string;
  descricao: string;
  capa_url: string | null;
  arquivo_url: string | null;
  tamanho_gb: string | null;
  principal: boolean;
  ativo: boolean;
}

export interface PacksDestaqueResponse {
  total: number;
  packs: PackResponse[];
}

export interface PacksListResponse {
  total: number;
  packs: PackResponse[];
}

export interface MeusPacksResponse {
  usuario_id: number;
  plano_atual: {
    id: number;
    slug: 'gratuito' | 'basic' | 'gold' | 'premium';
    nome: string;
    status: string;
    iniciado_em: string;
    expira_em: string | null;
  };
  packs: PackResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  health(): Observable<{message: string; database: string; timestamp: string}> {
    return this.http.get<{message: string; database: string; timestamp: string}>(
      `${this.backendUrl}/health`
    );
  }

  syncAuth(payload: SyncAuthPayload): Observable<SyncAuthResponse> {
    return this.http.post<SyncAuthResponse>(`${this.backendUrl}/auth/sync`, payload);
  }

  getPacksDestaque(limite = 10): Observable<PacksDestaqueResponse> {
    return this.http.get<PacksDestaqueResponse>(`${this.backendUrl}/packs/destaques?limite=${limite}`);
  }

  getAllPacks(): Observable<PacksListResponse> {
    return this.http.get<PacksListResponse>(`${this.backendUrl}/packs`);
  }

  getMeusPacks(usuarioId: number): Observable<MeusPacksResponse> {
    return this.http.get<MeusPacksResponse>(`${this.backendUrl}/usuarios/me/packs`, {
      headers: new HttpHeaders({
        'x-usuario-id': String(usuarioId)
      })
    });
  }
}
