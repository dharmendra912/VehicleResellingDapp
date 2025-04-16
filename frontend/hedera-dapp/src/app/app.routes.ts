// app.routes.ts or app-routing.module.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { VehicleRegisterComponent } from './components/vehicle-register/vehicle-register.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { VehicleSearchComponent } from './components/vehicle-search/vehicle-search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'user/search', component: UserSearchComponent },
  { path: 'vehicle/register', component: VehicleRegisterComponent },
  { path: 'vehicle/search', component: VehicleSearchComponent },
  { path: 'vehicle/:regNo', component: VehicleDetailsComponent },
  { path: '**', redirectTo: '' }
];
