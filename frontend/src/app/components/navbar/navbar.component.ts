import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isNavbarHidden = false;
  isMobileMenuOpen = false;
  isMenuOpen = false; // <- Corrigido: usado no HTML para o toggle

  private lastScroll = 0;
  private readonly SCROLL_THRESHOLD = 100;
  private readonly SCROLL_DELTA = 5;

  isMobileView = false;

  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.isMobileMenuOpen) return;

    const currentScroll = window.pageYOffset;

    if (Math.abs(currentScroll - this.lastScroll) < this.SCROLL_DELTA) return;

    if (currentScroll > this.lastScroll && currentScroll > this.SCROLL_THRESHOLD) {
      this.isNavbarHidden = true;
    } else if (currentScroll < this.lastScroll || currentScroll <= this.SCROLL_THRESHOLD) {
      this.isNavbarHidden = false;
    }

    this.lastScroll = currentScroll;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
    if (!this.isMobileView && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth <= 991.98;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isMenuOpen = this.isMobileMenuOpen; // <- Mantém isMenuOpen sincronizado
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar') && !target.closest('.navbar-toggler') && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
