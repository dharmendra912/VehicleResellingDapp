import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../../services/web3.service';
import { DialogService } from '../../services/dialog.service';

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
              <div *ngIf="web3Service.userAddress$ | async as address; else notConnected">
                <span class="text-muted small">
                  Connected: {{ address }}
                </span>
                <a
                  [routerLink]="['/user/profile']"
                  [queryParams]="{ address: address }"
                  class="btn btn-primary btn-sm ms-2"
                >
                  My Profile
                </a>
                <button class="btn btn-outline-primary btn-sm ms-2" (click)="disconnectWallet()">
                  Disconnect
                </button>
              </div>
              <ng-template #notConnected>
                <button class="btn btn-primary btn-sm" (click)="connectWallet()">
                  Connect Wallet
                </button>
              </ng-template>
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
  constructor(
    public web3Service: Web3Service,
    private dialogService: DialogService
  ) {}

  async connectWallet() {
    try {
      await this.web3Service.connectWallet();
    } catch (error) {
      this.dialogService.showError('Wallet Connection', 'Failed to connect wallet');
    }
  }

  async disconnectWallet() {
    try {
      await this.web3Service.disconnectWallet();
    } catch (error) {
      this.dialogService.showError('Wallet Disconnection', 'Failed to disconnect wallet');
    }
  }
}
