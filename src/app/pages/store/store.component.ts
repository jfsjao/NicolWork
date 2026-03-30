import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { ApiService } from '@core/api.service';
import { mapPacksWithImage } from '@core/pack-image-map';
import { finalize } from 'rxjs';

interface StoreHighlight {
  image: string;
  alt: string;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  private apiService = inject(ApiService);

  packCategories = [
    {
      number: '1',
      title: 'Plugins',
      description: 'Scripts, presets, plugins e recursos para agilizar seu fluxo e facilitar sua edicao.'
    },
    {
      number: '2',
      title: 'Videos',
      description: 'Arquivos em MP4, MOV e outros formatos prontos para editar e reutilizar no seu conteudo.'
    },
    {
      number: '3',
      title: 'Imagens',
      description: 'Arquivos em PNG, JPG e outros formatos uteis para composicoes, thumbnails e posts.'
    },
    {
      number: '4',
      title: 'Photoshop',
      description: 'Mockups, texturas, templates, actions e materiais em PSD para acelerar sua criacao.'
    },
    {
      number: '5',
      title: 'Outros',
      description: 'Arquivos complementares, referencias e materiais extras que ampliam ainda mais o pack.'
    }
  ];

  partnerLogos: StoreHighlight[] = [];
  repeatedPartnerLogos: StoreHighlight[] = [];
  isLoadingPopularPacks = true;
  popularPacksError = false;

  premiumFeatures = [
    'Baixar Reels',
    'Banco de videos exclusivos',
    'Coral Pack completo',
    'Elementos premium',
    'Emojis exclusivos',
    'Fundos de video HD',
    'Illustrator Pack',
    'Presets Lightroom',
    'Otimizacao de imagem',
    'Pack de IA para edicao',
    'Templates After Effects',
    'Backgrounds animados',
    'Templates Canva',
    'Pacote de icones premium',
    'Templates de edicao de video',
    'Modelos Excel para gestao',
    'Conteudo PLR exclusivo',
    'Templates Premiere Pro',
    'Ferramentas de remocao de fundo',
    'Personagens editaveis',
    'Actions Photoshop',
    'Programas bonus',
    'Transicoes profissionais',
    'Efeitos VFX premium',
    'Videos virais prontos'
  ];

  goldFeatures = [
    'Coral Pack completo',
    'Elementos premium',
    'Emojis exclusivos',
    'Fundos de video HD',
    'Pack de IA para edicao',
    'Backgrounds animados',
    'Templates Canva',
    'Pacote de icones premium',
    'Templates de edicao de video',
    'Templates Premiere Pro',
    'Personagens editaveis',
    'Actions Photoshop',
    'Programas bonus',
    'Transicoes profissionais',
    'Efeitos VFX premium',
    'Videos virais prontos'
  ];

  basicFeatures = [
    'Coral Pack basico',
    'Elementos essenciais',
    'Emojis basicos',
    'Pacote de icones',
    'Templates de edicao de video',
    'Templates Premiere Pro',
    'Actions Photoshop',
    'Programas basicos',
    'Transicoes simples',
    'Videos virais basicos'
  ];

  ngOnInit(): void {
    this.loadPopularPacks();
  }

  private loadPopularPacks(): void {
    this.apiService.getPacksDestaque(10).pipe(
      finalize(() => {
        this.isLoadingPopularPacks = false;
      })
    ).subscribe({
      next: ({ packs }) => {
        this.popularPacksError = false;

        this.partnerLogos = mapPacksWithImage(packs).map((pack) => ({
          image: pack.image,
          alt: pack.nome
        }));
        this.repeatedPartnerLogos = [...this.partnerLogos, ...this.partnerLogos];
      },
      error: (error) => {
        this.popularPacksError = true;
        this.partnerLogos = [];
        this.repeatedPartnerLogos = [];
        console.error('Erro ao carregar packs populares na store:', error);
      }
    });
  }
}
