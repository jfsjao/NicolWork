import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideClientHydration(),
    provideToastr({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    provideAnimations(),
    { provide: NgbConfig, useValue: new NgbConfig() }
  ]
};