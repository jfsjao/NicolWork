import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface PackItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  badge: string;
  locked?: boolean;
}

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent {
  searchTerm = '';
  private readonly ROW_SCROLL_AMOUNT = 960;

  myPacks: PackItem[] = [
    {
      id: 1,
      title: 'Baixar Reels',
      description: 'Materiais essenciais para comecar com mais qualidade.',
      image: 'assets/images/packs/baixar_reels.webp',
      category: 'Liberados',
      badge: 'Liberado'
    },
    {
      id: 2,
      title: 'Kit After Effects',
      description: 'Modelos prontos para videos curtos e reels.',
      image: 'assets/images/packs/kit_after_effects.webp',
      category: 'Liberados',
      badge: 'Novo'
    },
    {
      id: 3,
      title: 'Emojis',
      description: 'Ajustes rapidos para elevar o visual do conteudo.',
      image: 'assets/images/packs/emojis.webp',
      category: 'Liberados',
      badge: 'Popular'
    },
    {
      id: 11,
      title: 'Transicoes',
      description: 'Cortes, transicoes e encaixes para edicoes mais fluidas.',
      image: 'assets/images/packs/transições.webp',
      category: 'Liberados',
      badge: 'Atualizado'
    },
    {
      id: 15,
      title: 'Programas',
      description: 'Base de apps e utilitarios para acelerar seu fluxo.',
      image: 'assets/images/packs/programas.webp',
      category: 'Liberados',
      badge: 'Essencial'
    },
    {
      id: 16,
      title: 'Presets Lightroom',
      description: 'Ajustes prontos para foto, capa e feed com mais impacto.',
      image: 'assets/images/packs/presets_lightroom.webp',
      category: 'Liberados',
      badge: 'Curado'
    }
  ];

  popularPacks: PackItem[] = [
    {
      id: 4,
      title: 'Illustrator Pack',
      description: 'O pacote mais completo da plataforma.',
      image: 'assets/images/packs/illustrator_Pack.webp',
      category: 'Populares',
      badge: 'Top 1'
    },
    {
      id: 5,
      title: 'Pack IA',
      description: 'Conteudos visuais focados em retencao.',
      image: 'assets/images/packs/IA.webp',
      category: 'Populares',
      badge: 'Em alta'
    },
    {
      id: 6,
      title: 'Photoshop Pack',
      description: 'Biblioteca avancada para creators mais exigentes.',
      image: 'assets/images/packs/kit_photoshop.webp',
      category: 'Populares',
      badge: 'Premium',
      locked: true
    },
    {
      id: 12,
      title: 'VFX Pack',
      description: 'Explosoes visuais, energia e impacto para reels e edits.',
      image: 'assets/images/packs/VFX.webp',
      category: 'Populares',
      badge: 'Trending'
    },
    {
      id: 17,
      title: 'Premiere Pack',
      description: 'Biblioteca forte para timeline, ritmo e acabamento.',
      image: 'assets/images/packs/premiere.webp',
      category: 'Populares',
      badge: 'Hot'
    },
    {
      id: 18,
      title: 'Ferramentas Online',
      description: 'Recursos praticos para creators que produzem em escala.',
      image: 'assets/images/packs/ferramentas_online.webp',
      category: 'Populares',
      badge: 'Top choice'
    }
  ];

  newPacks: PackItem[] = [
    {
      id: 7,
      title: 'Pack Stories Pro',
      description: 'Templates modernos para stories e anuncios.',
      image: 'assets/images/packs/PACK_VIRAL.webp',
      category: 'Novidades',
      badge: 'Novo'
    },
    {
      id: 8,
      title: 'Motion Fast Pack',
      description: 'Elementos e composicoes com mais impacto visual.',
      image: 'assets/images/packs/elementos.webp',
      category: 'Novidades',
      badge: 'Atualizado'
    },
    {
      id: 13,
      title: 'Pack Canva',
      description: 'Assets prontos para posts, artes e criativos mais rapidos.',
      image: 'assets/images/packs/canva.webp',
      category: 'Novidades',
      badge: 'Fresh'
    },
    {
      id: 19,
      title: 'Icones Pro',
      description: 'Colecao de icones para interface, post e material visual.',
      image: 'assets/images/packs/icones.webp',
      category: 'Novidades',
      badge: 'Novo drop'
    },
    {
      id: 20,
      title: 'Personagens',
      description: 'Recortes, renders e personagens para composicoes mais ricas.',
      image: 'assets/images/packs/personagens.webp',
      category: 'Novidades',
      badge: 'Atualizado'
    }
  ];

  premiumSuggestions: PackItem[] = [
    {
      id: 9,
      title: 'Elite Premium Pack',
      description: 'Acesso aos materiais mais completos da plataforma.',
      image: 'assets/images/packs/Pack_PLRs.webp',
      category: 'Premium',
      badge: 'Upgrade',
      locked: true
    },
    {
      id: 10,
      title: 'Full Creator Library',
      description: 'Biblioteca premium com conteudos exclusivos.',
      image: 'assets/images/packs/banco_de_videos.webp',
      category: 'Premium',
      badge: 'Exclusivo',
      locked: true
    },
    {
      id: 14,
      title: 'Backgrounds Pro',
      description: 'Pacote premium com cenarios, fundos e composicoes exclusivas.',
      image: 'assets/images/packs/kit_background.webp',
      category: 'Premium',
      badge: 'Elite',
      locked: true
    },
    {
      id: 21,
      title: 'Capa Pack Edicao',
      description: 'Selecao premium de capas, cenas e composicoes para edits.',
      image: 'assets/images/packs/capa_pack_edição.webp',
      category: 'Premium',
      badge: 'Ultra',
      locked: true
    },
    {
      id: 22,
      title: 'Banco de Elementos',
      description: 'Biblioteca premium com elementos visuais para varias areas.',
      image: 'assets/images/packs/elementos.webp',
      category: 'Premium',
      badge: 'Vault',
      locked: true
    }
  ];

  filterPacks(packs: PackItem[]): PackItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return packs;

    return packs.filter(pack =>
      pack.title.toLowerCase().includes(term) ||
      pack.description.toLowerCase().includes(term) ||
      pack.badge.toLowerCase().includes(term)
    );
  }

  scrollRow(rowId: string, direction: number): void {
    const row = document.getElementById(rowId);

    if (!row) return;

    row.scrollBy({
      left: this.ROW_SCROLL_AMOUNT * direction,
      behavior: 'smooth'
    });
  }
}
