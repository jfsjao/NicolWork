export type PackWithImage<T extends { slug?: string; nome?: string }> = T & {
  image: string;
};

const DEFAULT_PACK_IMAGE = 'assets/images/packs/elementos.webp';

// Keep this map aligned with the current backend slugs.
const PACK_IMAGES: Record<string, string> = {
  'banco-videos-profissionais': 'assets/images/packs/banco_de_videos.webp',
  'banco-videos-virais': 'assets/images/packs/PACK_VIRAL.webp',
  'biblioteca-backgrounds': 'assets/images/packs/kit_background.webp',
  'biblioteca-conteudos-plr': 'assets/images/packs/Pack_PLRs.webp',
  'biblioteca-elementos': 'assets/images/packs/elementos.webp',
  'download-reels': 'assets/images/packs/baixar_reels.webp',
  'efeitos-trilhas-sonoras': 'assets/images/packs/Efeitos-e-Trilha-Sonoras.webp',
  'icones-profissionais': 'assets/images/packs/icones.webp',
  'kit-designer': 'assets/images/packs/kit_designer.webp',
  'kit-edicao-video': 'assets/images/packs/capa_pack_edição.webp',
  'kit-influencer': 'assets/images/packs/kit_influencer.webp',
  'kit-marketing-digital': 'assets/images/packs/kit-marketing.webp',
  'kit-streamer': 'assets/images/packs/kit_streamer.webp',
  'kit-youtube': 'assets/images/packs/kit_youtuber.webp',
  'kit-youtuber': 'assets/images/packs/kit_youtuber.webp',
  'modelos-gestao-excel': 'assets/images/packs/Modelos-Excel.webp',
  'pack-adobe-illustrator': 'assets/images/packs/illustrator_Pack.webp',
  'pack-adobe-lightroom': 'assets/images/packs/presets_lightroom.webp',
  'pack-adobe-photoshop': 'assets/images/packs/kit_photoshop.webp',
  'pack-adobe-premiere': 'assets/images/packs/premiere.webp',
  'pack-after-effects': 'assets/images/packs/kit_after_effects.webp',
  'pack-coreldraw': 'assets/images/packs/Pacote-CorelDraw.webp',
  'pack-efeitos-vfx': 'assets/images/packs/VFX.webp',
  'pack-emojis': 'assets/images/packs/emojis.webp',
  'pack-personagens-editaveis': 'assets/images/packs/personagens.webp',
  'pack-transicoes-dinamicas': 'assets/images/packs/transições.webp',
  'sistema-inteligencia-artificial': 'assets/images/packs/IA.webp',
  'softwares-criador': 'assets/images/packs/programas.webp',
  'suite-ferramentas-online': 'assets/images/packs/ferramentas_online.webp',
  'templates-canva': 'assets/images/packs/canva.webp',
};

function normalizePackKey(value?: string | null): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function getPackImageBySlug(slug?: string | null): string {
  const normalizedSlug = normalizePackKey(slug);
  return PACK_IMAGES[normalizedSlug] ?? DEFAULT_PACK_IMAGE;
}

export function getPackImageByName(name?: string | null): string {
  const normalizedName = normalizePackKey(name);
  return PACK_IMAGES[normalizedName] ?? DEFAULT_PACK_IMAGE;
}

export function resolvePackImage(pack: { slug?: string | null; nome?: string | null }): string {
  const normalizedSlug = normalizePackKey(pack.slug);

  if (normalizedSlug && PACK_IMAGES[normalizedSlug]) {
    return PACK_IMAGES[normalizedSlug];
  }

  const normalizedName = normalizePackKey(pack.nome);

  if (normalizedName && PACK_IMAGES[normalizedName]) {
    return PACK_IMAGES[normalizedName];
  }

  return DEFAULT_PACK_IMAGE;
}

export function mapPackWithImage<T extends { slug?: string; nome?: string }>(pack: T): PackWithImage<T> {
  return {
    ...pack,
    image: resolvePackImage(pack)
  };
}

export function mapPacksWithImage<T extends { slug?: string; nome?: string }>(packs: T[]): Array<PackWithImage<T>> {
  return packs.map((pack) => mapPackWithImage(pack));
}
