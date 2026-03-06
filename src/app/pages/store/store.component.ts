import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {
  stats = {
    clients: 500,
    years: 1,
    satisfaction: 100
  };

  joaoGuilhermeImage = 'assets/images/depoimentos/joaoguilherme.png';
  gustavoJoseImage = 'assets/images/depoimentos/gustavojose.png';

  packCategories = [
    {
      number: '1',
      title: 'Plugins',
      description: 'Scripts, presets, plugins e recursos para agilizar seu fluxo e facilitar sua edição.'
    },
    {
      number: '2',
      title: 'Vídeos',
      description: 'Arquivos em MP4, MOV e outros formatos prontos para editar e reutilizar no seu conteúdo.'
    },
    {
      number: '3',
      title: 'Imagens',
      description: 'Arquivos em PNG, JPG e outros formatos úteis para composições, thumbnails e posts.'
    },
    {
      number: '4',
      title: 'Photoshop',
      description: 'Mockups, texturas, templates, actions e materiais em PSD para acelerar sua criação.'
    },
    {
      number: '5',
      title: 'Outros',
      description: 'Arquivos complementares, referências e materiais extras que ampliam ainda mais o pack.'
    }
  ];

  partnerLogos = [
    { image: 'assets/images/depoimentos/joaoguilherme.png', alt: 'Pack de backgrounds' },
    { image: 'assets/images/depoimentos/gustavojose.png', alt: 'Pack de programas' },
    { image: 'assets/images/depoimentos/joaoguilherme.png', alt: 'Pack de sfx' },
    { image: 'assets/images/depoimentos/gustavojose.png', alt: 'Pack de scripts' },
    { image: 'assets/images/depoimentos/joaoguilherme.png', alt: 'Pack de fontes' }
  ];

  premiumFeatures = [
    "Baixar Reels",
    "Banco de vídeos exclusivos",
    "Coral Pack completo",
    "Elementos premium",
    "Emojis exclusivos",
    "Fundos de vídeo HD",
    "Illustrator Pack",
    "Presets Lightroom",
    "Otimização de imagem",
    "Pack de IA para edição",
    "Templates After Effects",
    "Backgrounds animados",
    "Templates Canva",
    "Pacote de ícones premium",
    "Templates de edição de vídeo",
    "Modelos Excel para gestão",
    "Conteúdo PLR exclusivo",
    "Templates Premiere Pro",
    "Ferramentas de remoção de fundo",
    "Personagens editáveis",
    "Actions Photoshop",
    "Programas bônus",
    "Transições profissionais",
    "Efeitos VFX premium",
    "Vídeos virais prontos"
  ];

  goldFeatures = [
    "Coral Pack completo",
    "Elementos premium",
    "Emojis exclusivos",
    "Fundos de vídeo HD",
    "Pack de IA para edição",
    "Backgrounds animados",
    "Templates Canva",
    "Pacote de ícones premium",
    "Templates de edição de vídeo",
    "Templates Premiere Pro",
    "Personagens editáveis",
    "Actions Photoshop",
    "Programas bônus",
    "Transições profissionais",
    "Efeitos VFX premium",
    "Vídeos virais prontos"
  ];

  basicFeatures = [
    "Coral Pack básico",
    "Elementos essenciais",
    "Emojis básicos",
    "Pacote de ícones",
    "Templates de edição de vídeo",
    "Templates Premiere Pro",
    "Actions Photoshop",
    "Programas básicos",
    "Transições simples",
    "Vídeos virais básicos"
  ];
}