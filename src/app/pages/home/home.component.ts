import { Component, AfterViewInit, OnDestroy, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/api.service';
import { mapPacksWithImage } from '@core/pack-image-map';
import { finalize } from 'rxjs';

interface Slide {
  image: string;
  mobileImage?: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface HighlightCard {
  image: string;
  alt: string;
}

interface PackFeature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('autoVideo') autoVideo!: ElementRef<HTMLVideoElement>;
  private apiService = inject(ApiService);

  slides: Slide[] = [
    {
      image: 'assets/images/carrosel/banner1.gif',
      mobileImage: 'assets/images/empresa/nico-marketing.jpg',
      alt: 'Imagem destaque 1',
      title: 'Descubra conteúdos que aceleram sua criação',
      description: 'Entre nos banners e navegue direto para as áreas mais importantes da plataforma.',
      buttonText: 'Explorar agora',
      buttonLink: '/plans'
    },
    {
      image: 'assets/images/carrosel/banner2.gif',
      mobileImage: 'assets/images/packs/PACK_VIRAL.webp',
      alt: 'Pack Edit',
      title: 'Conteúdos completos para edição e design',
      description: 'Packs variados para ajudar na edição de vídeos, fotos e criativos com mais impacto.',
      buttonText: 'Ver packs',
      buttonLink: '/plans'
    },
    {
      image: 'assets/images/carrosel/banner3.gif',
      mobileImage: 'assets/images/empresa/nico-coringa.jpg',
      alt: 'Sobre nós',
      title: 'Conheça a All In de perto',
      description: 'Veja como a empresa funciona e o que entregamos para creators, designers e editores.',
      buttonText: 'Sobre nós',
      buttonLink: '/about'
    }
  ];

  joaoGuilhermeImage = 'assets/images/depoimentos/joaoguilherme.png';
  gustavoJoseImage = 'assets/images/depoimentos/gustavojose.png';
  packsupremoImage = 'assets/images/empresa/pack_supremo.png';
  popularPackCards: HighlightCard[] = [];
  isLoadingPopularPacks = true;
  popularPacksError = false;

  packFeatures: PackFeature[] = [
    { title: 'Criação e Edição de Vídeo', description: 'Tudo que você precisa para criar conteúdos dinâmicos e com alto potencial de viralização.' },
    { title: 'Design Gráfico e Artes', description: 'Tudo que você precisa para criar artes de alto nível e destacar seu conteúdo visual.' },
    { title: 'Inteligência Artificial e Automação', description: 'Tudo que você precisa para produzir mais rápido, com menos esforço e mais eficiência.' },
    { title: 'Recursos Prontos e Templates', description: 'Tudo que você precisa para ganhar tempo e criar com rapidez e qualidade.' },
    { title: 'Marketing e Crescimento Digital', description: 'Tudo que você precisa para crescer, atrair público e gerar resultados com seu conteúdo.' },
    { title: 'Ferramentas e Produtividade', description: 'Tudo que você precisa para trabalhar de forma mais organizada e produtiva.' },
  ];

  currentSlide = 0;
  isVideoMuted = true;
  isVideoPlaying = false;

  private videoObserver!: IntersectionObserver;
  private carouselInterval: number | null = null;
  private readonly CAROUSEL_DELAY = 11000;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPopularPacks();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initCarousels();
    this.initVideoObserver();
    this.syncVideoState();
  }

  ngOnDestroy(): void {
    this.clearIntervals();

    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.restartCarousel();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.restartCarousel();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.restartCarousel();
    }
  }

  onVideoPlay(): void {
    this.isVideoPlaying = true;
  }

  onVideoPause(): void {
    this.isVideoPlaying = false;
  }

  onVideoVolumeChange(): void {
    if (!this.autoVideo) return;
    this.isVideoMuted = this.autoVideo.nativeElement.muted;
  }

  private initCarousels(): void {
    this.startCarousel();
  }

  private initVideoObserver(): void {
    if (!this.autoVideo) return;

    this.videoObserver = new IntersectionObserver(([entry]) => {
      const video = this.autoVideo.nativeElement;

      if (entry.isIntersecting) {
        video.play().then(() => {
          this.isVideoPlaying = true;
        }).catch(() => {});
      } else {
        video.pause();
        this.isVideoPlaying = false;
      }
    });

    this.videoObserver.observe(this.autoVideo.nativeElement);
  }

  private clearIntervals(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }

  }

  private startCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    this.carouselInterval = window.setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, this.CAROUSEL_DELAY);
  }

  private restartCarousel(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.startCarousel();
  }

  private syncVideoState(): void {
    if (!this.autoVideo) return;

    const video = this.autoVideo.nativeElement;
    this.isVideoMuted = video.muted;
    this.isVideoPlaying = !video.paused;
  }

  private loadPopularPacks(): void {
    this.apiService.getPacksDestaque(10).pipe(
      finalize(() => {
        this.isLoadingPopularPacks = false;
      })
    ).subscribe({
      next: ({ packs }) => {
        this.popularPacksError = false;
        this.popularPackCards = mapPacksWithImage(packs).map((pack) => ({
          image: pack.image,
          alt: pack.nome
        }));
      },
      error: (error) => {
        this.popularPacksError = true;
        this.popularPackCards = [];
        console.error('Erro ao carregar packs populares na home:', error);
      }
    });
  }
}
