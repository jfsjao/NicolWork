import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClipboardService } from '../../core/services/clipboard/clipboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent {
  toggleMobileMenu() {
    throw new Error('Method not implemented.');
  }
  authLinks: any;
  closeMobileMenu() {
    throw new Error('Method not implemented.');
  }
  private clipboard = inject(ClipboardService);
  private toastr = inject(ToastrService);

  links = [
    { path: '/', title: 'Home' },
    { path: '/about', title: 'Sobre' },
    { path: '/services', title: 'Serviços' },
    { path: '/contact', title: 'Contato' }
  ];

  currentYear = new Date().getFullYear();
  showNotification = false;
  notificationMessage = '';
  notificationPosition = { top: '0', left: '0' };
  isMobileMenuOpen: any;

  async copyContact(value: string, type: 'email' | 'phone', event: MouseEvent) {
    const success = await this.clipboard.copyToClipboard(value);

    if (success) {
      this.showToastNotification(
        type === 'email' ? 'Email copiado!' : 'Telefone copiado!',
        event
      );
    } else {
      this.toastr.error('Falha ao copiar', '', {
        positionClass: 'toast-bottom-center'
      });
    }
  }

  private showToastNotification(message: string, event: MouseEvent) {
    // Position near the clicked element
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.notificationPosition = {
      top: `${rect.top - 40}px`,
      left: `${rect.left + rect.width / 2 - 50}px`
    };

    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 2000);
  }
}