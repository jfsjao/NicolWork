import { Routes } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export const routes: Routes = [
      { 
        path: 'home', 
        loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent) 
      },
      { 
        path: 'services', 
        loadComponent: () => import('../pages/services/services.component').then(m => m.ServicesComponent) 
      },
      { 
        path: 'about', 
        loadComponent: () => import('../pages/about/about.component').then(m => m.AboutComponent) 
      },
      { 
        path: 'contact', 
        loadComponent: () => import('../pages/contact/contact.component').then(m => m.ContactComponent) 
      },
      { 
        path: 'auth', 
        loadComponent: () => import('../pages/auth/auth.component').then(m => m.AuthComponent) 
      }
    ];