import { Component, OnInit, Inject, HostListener, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BrandLogoComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);

  isNavbarHidden = false;
  isMobileMenuOpen = false;
  isMenuOpen = false;
  isMobileView = false;
  isUserMenuOpen = false;

  private lastScroll = 0;
  private readonly SCROLL_THRESHOLD = 100;
  private readonly SCROLL_DELTA = 5;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkViewport();
    }
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get displayUserName(): string {
    const user = this.currentUser;

    if (!user) return 'Usuário';
    if (user.displayName && user.displayName.trim()) return user.displayName;

    return user.email?.split('@')[0] || 'Usuário';
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  handleDropdownNavigation() {
    this.isUserMenuOpen = false;
    this.closeMobileMenu();
  }

  async onLogout() {
    this.isUserMenuOpen = false;
    this.closeMobileMenu();
    await this.authService.logout();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.isBrowser || this.isMobileMenuOpen) return;

    const currentScroll = window.pageYOffset;

    if (Math.abs(currentScroll - this.lastScroll) < this.SCROLL_DELTA) return;

    if (currentScroll > this.lastScroll && currentScroll > this.SCROLL_THRESHOLD) {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }

    this.lastScroll = currentScroll;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isBrowser) return;

    this.checkViewport();

    if (!this.isMobileView && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private checkViewport() {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth <= 991.98;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isMenuOpen = this.isMobileMenuOpen;

    if (this.isBrowser) {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.isMenuOpen = false;

      if (this.isBrowser) {
        document.body.style.overflow = '';
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.isBrowser) return;

    const target = event.target as HTMLElement;

    if (!target.closest('.navbar') && !target.closest('.navbar-toggler') && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }

    if (!target.closest('.user-menu-wrapper')) {
      this.isUserMenuOpen = false;
    }
  }
}
