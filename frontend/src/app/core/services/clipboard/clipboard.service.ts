import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      // Fallback para navegadores mais antigos
      if (!navigator.clipboard) {
        return this.copyWithExecCommand(text);
      }
      
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }

  private copyWithExecCommand(text: string): boolean {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';  // Evitar scrolling
      document.body.appendChild(textarea);
      textarea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      return success;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  }
}