// app.routes.ts or app-routing.module.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { VehicleRegisterComponent } from './components/vehicle-register/vehicle-register.component';
import { UserSearchComponent } from './components/user-search/user-search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'vehicle/register', component: VehicleRegisterComponent },
  { path: 'vehicle/:regNo', component: VehicleDetailsComponent },
  { path: 'user/search', component: UserSearchComponent },
  { path: '**', redirectTo: '' }
];
