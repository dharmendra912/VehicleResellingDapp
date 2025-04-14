import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Web3Service } from './services/web3.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    Web3Service,
  ]
};
