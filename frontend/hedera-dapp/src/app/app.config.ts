import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { Web3Service } from './services/web3.service';
import { UserContractService } from './services/user-contract.service';
import { VehicleContractService } from './services/vehicle-contract.service';
import { DialogService } from './services/dialog.service';
import { LoadingService } from './services/loading.service';
import { GlobalDependenciesService } from './services/global-dependencies.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    Web3Service,
    UserContractService,
    VehicleContractService,
    DialogService,
    LoadingService,
    GlobalDependenciesService
  ]
};
