import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Search Users</h5>
            <div class="mb-4">
              <label for="searchAddress" class="form-label">Wallet Address</label>
              <div class="input-group">
                <input
                  id="searchAddress"
                  type="text"
                  class="form-control"
                  placeholder="Enter wallet address"
                  [(ngModel)]="searchAddress"
                  (keyup.enter)="searchUser()"
                >
                <button 
                  class="btn btn-primary px-4" 
                  type="button" 
                  (click)="searchUser()"
                  [disabled]="!searchAddress || isLoading"
                >
                  <i class="bi bi-search me-2"></i>
                  <span *ngIf="!isLoading">Search</span>
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm"></span>
                </button>
              </div>
            </div>

            <div *ngIf="error" class="alert alert-danger">
              {{ error }}
            </div>

            <div *ngIf="userProfile" class="mt-3">
              <div class="card">
                <div class="card-body">
                  <h6 class="card-subtitle mb-3 text-muted">User Profile</h6>
                  <p class="card-text">
                    <strong>Name:</strong> {{ userProfile.name || 'Not provided' }}<br>
                    <strong>Phone:</strong> {{ userProfile.phone || 'Not provided' }}<br>
                    <strong>Address:</strong> {{ searchAddress }}
                  </p>
                  <a
                    [routerLink]="['/user/profile']"
                    [queryParams]="{ address: searchAddress }"
                    class="btn btn-outline-primary btn-sm"
                  >
                    View Full Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-group {
      max-width: 600px;
    }
    .btn:disabled {
      opacity: 0.65;
    }
  `]
})
export class UserSearchComponent {
  searchAddress = '';
  userProfile: { name: string; phone: string; vehicles: string[] } | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(
    private web3Service: Web3Service
  ) {}

  async searchUser() {
    if (!this.searchAddress) {
      this.error = 'Please enter a wallet address';
      return;
    }

    try {
      this.error = null;
      this.isLoading = true;
      this.userProfile = await this.web3Service.getUserProfile(this.searchAddress);
    } catch (error) {
      console.error('Error searching user:', error);
      this.error = 'Failed to find user. Please check the address and try again.';
      this.userProfile = null;
    } finally {
      this.isLoading = false;
    }
  }
} 