import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService, MeusPacksResponse, PackResponse, PaidPlanSlug } from '../api.service';
import { mapPacksWithImage } from '../pack-image-map';

export type UserPlanSlug = 'gratuito' | 'basic' | 'pro' | 'premium';

export interface UserLibraryPack {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  locked: boolean;
  requiredPlan: UserPlanSlug;
  checkoutPlan: PaidPlanSlug | null;
  link: string;
  downloadUrl: string | null;
}

export interface UserLibraryData {
  userId: number;
  plan: {
    slug: UserPlanSlug;
    nome: string;
    status: string;
  };
  ownedPacks: UserLibraryPack[];
  featuredPacks: UserLibraryPack[];
  noveltyPacks: UserLibraryPack[];
  allPacks: UserLibraryPack[];
  upgradePacks: UserLibraryPack[];
  popularPacks: UserLibraryPack[];
}

const FREE_PLAN = {
  slug: 'gratuito' as const,
  nome: 'Gratuito',
  status: 'ativo'
};

const FREE_PACK_SLUGS = new Set([
  'kit-streamer',
  'kit-youtube',
  'kit-youtuber',
  'kit-influencer',
  'kit-designer'
]);

const BASIC_PACK_SLUGS = new Set([
  'biblioteca-elementos',
  'pack-emojis',
  'icones-profissionais',
  'efeitos-trilhas-sonoras',
  'kit-edicao-video',
  'pack-adobe-premiere',
  'pack-adobe-photoshop',
  'softwares-criador',
  'pack-transicoes-dinamicas',
  'banco-videos-virais'
]);

const PRO_PACK_SLUGS = new Set([
  ...BASIC_PACK_SLUGS,
  'pack-coreldraw',
  'sistema-inteligencia-artificial',
  'biblioteca-backgrounds',
  'templates-canva',
  'pack-personagens-editaveis',
  'pack-efeitos-vfx'
]);

@Injectable({
  providedIn: 'root'
})
export class UserLibraryService {
  private apiService = inject(ApiService);

  loadUserLibrary(usuarioId: number, busca = ''): Observable<UserLibraryData> {
    return forkJoin({
      meusPacks: this.apiService.getMeusPacks(usuarioId, busca),
      destaquePacks: this.apiService.getPacksDestaque(10, busca),
      allPacks: this.apiService.getAllPacks(busca)
    }).pipe(
      map(({ meusPacks, destaquePacks, allPacks }) => this.buildLibraryData(meusPacks, destaquePacks.packs, allPacks.packs))
    );
  }

  private buildLibraryData(
    meusPacks: MeusPacksResponse,
    destaquePacks: PackResponse[],
    allPacks: PackResponse[],
  ): UserLibraryData {
    const ownedPacks = mapPacksWithImage(meusPacks.packs).map((pack) => ({
      id: pack.id,
      slug: pack.slug,
      title: pack.nome,
      description: pack.descricao,
      image: pack.image,
      badge: 'Liberado',
      locked: false,
      requiredPlan: this.resolveRequiredPlan(pack.slug),
      checkoutPlan: null,
      link: '/library',
      downloadUrl: pack.arquivo_url
    }));

    const ownedPackIds = new Set(ownedPacks.map((pack) => pack.id));

    const featuredPacks = mapPacksWithImage(destaquePacks).map((pack, index) =>
      this.buildPackCard(pack, ownedPackIds.has(pack.id), `Top ${index + 1}`)
    );

    const featuredPackIds = new Set(featuredPacks.map((pack) => pack.id));

    const allPacksWithAccess = mapPacksWithImage(allPacks).map((pack) =>
      this.buildPackCard(pack, ownedPackIds.has(pack.id), ownedPackIds.has(pack.id) ? 'Liberado' : 'Upgrade')
    );

    const noveltyPacks = allPacksWithAccess
      .filter((pack) => !featuredPackIds.has(pack.id))
      .slice(0, 8)
      .map((pack, index) => ({
        ...pack,
        badge: pack.locked ? `Novo ${index + 1}` : `Novo ${index + 1}`
      }));

    const popularPacks = featuredPacks;

    const upgradePacks = allPacksWithAccess
      .filter((pack) => !ownedPackIds.has(pack.id))
      .map((pack) => ({
        id: pack.id,
        slug: pack.slug,
        title: pack.title,
        description: pack.description,
        image: pack.image,
        badge: 'Upgrade',
        locked: true,
        requiredPlan: pack.requiredPlan,
        checkoutPlan: pack.checkoutPlan,
        link: pack.link,
        downloadUrl: null
      }));

    return {
      userId: meusPacks.usuario_id,
      plan: this.resolvePlan(meusPacks),
      ownedPacks,
      featuredPacks,
      noveltyPacks,
      allPacks: allPacksWithAccess,
      upgradePacks,
      popularPacks
    };
  }

  private resolvePlan(meusPacks: MeusPacksResponse): UserLibraryData['plan'] {
    if (!meusPacks.plano_atual) {
      return FREE_PLAN;
    }

    return {
      slug: meusPacks.plano_atual.slug,
      nome: meusPacks.plano_atual.nome,
      status: meusPacks.plano_atual.status
    };
  }

  private buildPackCard(
    pack: PackResponse & { image: string },
    owned: boolean,
    badge: string
  ): UserLibraryPack {
    const requiredPlan = this.resolveRequiredPlan(pack.slug);
    const checkoutPlan = requiredPlan === 'gratuito' ? null : requiredPlan;

    return {
      id: pack.id,
      slug: pack.slug,
      title: pack.nome,
      description: pack.descricao,
      image: pack.image,
      badge,
      locked: !owned,
      requiredPlan,
      checkoutPlan,
      link: owned ? '/my-downloads' : checkoutPlan ? '/checkout' : '/library',
      downloadUrl: owned ? pack.arquivo_url : null
    };
  }

  private resolveRequiredPlan(slug: string): UserPlanSlug {
    if (FREE_PACK_SLUGS.has(slug)) {
      return 'gratuito';
    }

    if (BASIC_PACK_SLUGS.has(slug)) {
      return 'basic';
    }

    if (PRO_PACK_SLUGS.has(slug)) {
      return 'pro';
    }

    return 'premium';
  }
}
