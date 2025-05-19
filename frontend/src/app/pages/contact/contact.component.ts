import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardService } from '../../core/services/clipboard/clipboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private clipboard = inject(ClipboardService);
  private toastr = inject(ToastrService);
  
  showNotification = false;
  notificationMessage = '';
  copiedItemType: 'email' | 'phone' | 'instagram' | null = null;

  contactInfo = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  async copyContact(value: string, type: 'email' | 'phone' | 'instagram', event: MouseEvent) {
    event.preventDefault();
    this.showNotification = false;
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const success = await this.clipboard.copyToClipboard(value);
      
      if (success) {
        this.copiedItemType = type;
        this.notificationMessage = 
          type === 'email' ? 'Email copiado!' : 
          type === 'phone' ? 'Telefone copiado!' : 
          'Instagram copiado!';
        this.showNotification = true;
        
        setTimeout(() => {
          this.showNotification = false;
          this.copiedItemType = null;
        }, 2000);
      } else {
        this.toastr.error('Falha ao copiar para a área de transferência');
      }
    } catch (error) {
      this.toastr.error('Erro inesperado ao copiar');
    }
  }

  scrollToForm() {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitForm() {
    console.log('Form submitted:', this.contactInfo);
    alert('Formulário enviado com sucesso! (Simulação)');
    this.contactInfo = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}