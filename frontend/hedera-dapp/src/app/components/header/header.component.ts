import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div class="d-flex align-items-center gap-4">
            <a routerLink="/" class="text-decoration-none text-dark" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-house-door fs-5"></i>
            </a>
            <nav class="d-flex gap-3">
              <a routerLink="/user/search" class="text-decoration-none text-dark small" routerLinkActive="active">Search Users</a>
              <a routerLink="/user/profile" class="text-decoration-none text-dark small" routerLinkActive="active">My Profile</a>
              <a routerLink="/vehicle/search" class="text-decoration-none text-dark small" routerLinkActive="active">Search Vehicle</a>
              <a routerLink="/vehicle/register" class="text-decoration-none text-dark small" routerLinkActive="active">Register Vehicle</a>
            </nav>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div *ngIf="web3Service.loading$ | async" class="d-flex align-items-center text-muted">
              <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <span class="small">Updating...</span>
            </div>
            <div *ngIf="web3Service.isMetaMaskAvailable$ | async; else noMetaMask" class="d-flex align-items-center gap-2">
              <span class="text-muted small">
                Connected: {{ (web3Service.userAddress$ | async)?.slice(0, 6) }}...{{ (web3Service.userAddress$ | async)?.slice(-4) }}
              </span>
              <a 
                [routerLink]="['/user/profile']" 
                [queryParams]="{ address: web3Service.userAddress$ | async }"
                class="btn btn-outline-primary btn-sm"
              >
                My Profile
              </a>
            </div>
            <ng-template #noMetaMask>
              <div class="text-danger small">
                MetaMask not detected
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    nav a {
      transition: color 0.2s;
    }
    nav a:hover {
      color: var(--bs-primary) !important;
    }
    .active {
      color: var(--bs-primary) !important;
      font-weight: 500;
    }
  `]
})
export class HeaderComponent {
  constructor(public web3Service: Web3Service) {}
}
