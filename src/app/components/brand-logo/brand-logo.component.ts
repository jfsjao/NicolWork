import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-logo.component.html',
  styleUrl: './brand-logo.component.scss'
})
export class BrandLogoComponent {
  @Input() textSize = '1.9rem';
  @Input() logoHeight = '1.85em';
  @Input() ariaLabel = 'ALL IN';
}
