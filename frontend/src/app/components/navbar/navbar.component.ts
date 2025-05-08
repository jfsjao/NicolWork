import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isNavbarHidden = false;
  isMobileMenuOpen = false;
  private lastScroll = 0;
  private readonly SCROLL_THRESHOLD = 100; // Quantidade de pixels para começar a esconder
  private readonly SCROLL_DELTA = 5; // Sensibilidade do scroll

  @HostListener('window:scroll')
  onScroll() {
    const currentScroll = window.pageYOffset;
    
    // Só começa a esconder depois de passar um certo threshold
    if (Math.abs(currentScroll - this.lastScroll) < this.SCROLL_DELTA) return;
    
    // Rolando para baixo e passou do threshold
    if (currentScroll > this.lastScroll && currentScroll > this.SCROLL_THRESHOLD) {
      this.isNavbarHidden = true;
    } 
    // Rolando para cima ou no topo da página
    else if (currentScroll < this.lastScroll || currentScroll <= this.SCROLL_THRESHOLD) {
      this.isNavbarHidden = false;
    }
    
    this.lastScroll = currentScroll;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}