import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), // Habilita fetch API
    provideRouter(
      routes,
      withComponentInputBinding(), // Permite binding de inputs via rota
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) // Restaura scroll
    ),
    provideClientHydration(),
    provideToastr({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      progressBar: true
    }),
    provideAnimations(),
    { provide: NgbConfig, useValue: new NgbConfig() }
  ]
};