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
  stats = {
    years: 1,
    clients: 45,
    engagements: 10,
    satisfaction: 100
  };


}