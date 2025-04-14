// app.routes.ts or app-routing.module.ts
import { Routes } from '@angular/router';
import { VehicleRegistryComponent } from './vehicle-registry/vehicle-registry.component';
import {HederaConnectorComponent} from './hedera-connector/hedera-connector.component';

export const routes: Routes = [
  {
    path: 'vehicle-registry',
    component: VehicleRegistryComponent
  },
  {
    path: '',
    redirectTo: 'vehicle-registry',
    pathMatch: 'full'
  },
  {
    path: 'connector',
    component: HederaConnectorComponent
  }
];
