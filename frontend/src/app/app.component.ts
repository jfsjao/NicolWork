import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './core/api.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PingPong App';
  response = '';

  constructor(private apiService: ApiService) {}

  sendPing(): void {
    this.apiService.ping().subscribe({
      next: (data) => this.response = data.message,
      error: (err) => {
        console.error('Error:', err);
        this.response = 'Error connecting to backend';
      }
    });
  }
}