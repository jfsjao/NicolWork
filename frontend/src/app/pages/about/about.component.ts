import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, CountUpModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  clients = [
    { logo: 'logo-nike-256.png', name: 'Marca 1' },
    { logo: 'logo-nike-256.png', name: 'Marca 2' },
    { logo: 'logo-nike-256.png', name: 'Marca 3' },
    { logo: 'logo-nike-256.png', name: 'Marca 4' },
    { logo: 'logo-nike-256.png', name: 'Marca 5' },
  ];

  // Valores para as animações
  stats = {
    years: 1,
    clients: 5,
    engagements: 10,
    satisfaction: 100
  };

  getImagePath(logo: string): string {
    return `assets/images/logos/${logo}`;
  }

}