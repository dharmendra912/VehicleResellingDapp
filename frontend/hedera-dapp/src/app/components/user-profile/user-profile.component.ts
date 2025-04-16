import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserContractService } from '../../services/user-contract.service';
import { VehicleContractService } from '../../services/vehicle-contract.service';
import { Web3Service } from '../../services/web3.service';
import { LoadingService } from '../../services/loading.service';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';

interface UserProfile {
  name: string;
  phone: string;
  vehicles: string[];
  walletAddress: string;
}


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">User Profile</h1>
            <p class="text-sm text-gray-600">Manage profile information and vehicles</p>
          </div>

          <!-- Profile Form -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form (ngSubmit)="onSubmit()" class="space-y-8">
              <!-- Name Field -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-3">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="profile.name"
                  [disabled]="!isEditable"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                  required
                />
              </div>

              <!-- Phone Field -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="profile.phone"
                  [disabled]="!isEditable"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                  required
                />
              </div>

              <!-- Wallet Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Wallet Address</label>
                <div class="mt-1 flex items-center">
                  <span class="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                    {{ profile.walletAddress }}
                  </span>
                </div>
              </div>

              <!-- Submit Button -->
              <div *ngIf="isEditable" class="flex justify-end pt-2">
                <button
                  type="submit"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium  shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  [disabled]="isLoading"
                >
                  {{ isLoading ? 'Saving...' : 'Save Profile' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Vehicles Section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Vehicles</h2>

            <!-- No Vehicles Message -->
            <div *ngIf="profile.vehicles.length === 0"
                 class="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p class="text-sm text-gray-500">No vehicles registered yet</p>
            </div>

            <!-- Vehicles List -->
            <div *ngIf="profile.vehicles.length > 0" class="space-y-1">
              <a *ngFor="let vehicle of profile.vehicles"
                 [routerLink]="['/vehicle', vehicle]"
                 class="block px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                <span class="text-sm font-medium text-gray-900">{{ vehicle }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile = {
    name: '',
    phone: '',
    vehicles: [],
    walletAddress: ''
  };
  isEditable = false;
  isLoading = false;
  currentUserAddress: string | null = null;
  private userAddressSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private userContractService: UserContractService,
    private vehicleContractService: VehicleContractService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to route query params changes
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const viewAddress = params['address'];
      
      if (viewAddress) {
        // If we have an address in URL, check if it's the current user's address
        this.userAddressSubscription = this.web3Service.userAddress$.subscribe(address => {
          this.currentUserAddress = address;
          this.isEditable = address === viewAddress;
          this.loadProfile(viewAddress);
        });
      } else {
        // If no address in URL, subscribe to wallet changes for logged-in user's profile
        this.userAddressSubscription = this.web3Service.userAddress$.subscribe(address => {
          this.currentUserAddress = address;
          if (address) {
            this.isEditable = true;
            this.loadProfile(address);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.userAddressSubscription) {
      this.userAddressSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private async loadProfile(address: string) {
    try {
      console.log('Loading profile for address:', address);
      this.loadingService.show();

      // Fetch user profile data
      const profileData = await this.userContractService.getUserProfile(address);

      if (profileData) {
        // Update the profile object with the fetched data
        this.profile = {
          name: profileData.name || '',
          phone: profileData.phone || '',
          vehicles: profileData.vehicles || [],
          walletAddress: address
        };
      }

      console.log('Loaded profile:', this.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      this.dialogService.showError('Profile Load', 'Failed to load profile');
    } finally {
      this.loadingService.hide();
    }
  }

  async onSubmit() {
    if (!this.isEditable || !this.currentUserAddress) return;

    try {
      this.isLoading = true;
      await this.userContractService.updateUserProfile(
        this.profile.name,
        this.profile.phone
      );
      this.dialogService.showSuccess('Profile Update', 'Profile updated successfully');
    } catch (error) {
      this.dialogService.showError('Profile Update', 'Failed to update profile');
    } finally {
      this.isLoading = false;
    }
  }
}

