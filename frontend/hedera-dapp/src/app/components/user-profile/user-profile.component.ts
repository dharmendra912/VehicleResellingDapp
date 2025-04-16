import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Web3Service } from '../../services/web3.service';
import { Subscription } from 'rxjs';
import { ethers } from 'ethers';
import { USER_PROFILE_ABI, USER_PROFILE_CONTRACT_ADDRESS } from '../../ABIs/UserProfile.abi';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <div *ngIf="!isMetaMaskAvailable" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong class="font-bold">MetaMask Required!</strong>
          <span class="block sm:inline"> Please install MetaMask to view user profile.</span>
        </div>

        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
            
            <div *ngIf="isEditable" class="mb-6">
              <form (ngSubmit)="updateProfile()" class="space-y-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    [(ngModel)]="profile.name"
                    name="name"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Enter name"
                  />
                </div>
                
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                  <input
                    [(ngModel)]="profile.phone"
                    name="phone"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Enter phone number"
                  />
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    [disabled]="isLoading"
                  >
                    <span *ngIf="!isLoading">Update Profile</span>
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm"></span>
                  </button>
                </div>
              </form>
            </div>
            
            <div *ngIf="!isEditable" class="space-y-4">
              <div>
                <p class="text-gray-600">Name:</p>
                <p class="font-semibold">{{ profile.name || 'Not provided' }}</p>
              </div>
              
              <div>
                <p class="text-gray-600">Phone:</p>
                <p class="font-semibold">{{ profile.phone || 'Not provided' }}</p>
              </div>
              
              <div>
                <p class="text-gray-600">Address:</p>
                <p class="font-mono">{{ address }}</p>
              </div>

              <div *ngIf="profile.vehicles && profile.vehicles.length > 0">
                <p class="text-gray-600">Vehicles:</p>
                <div class="space-y-2">
                  <a
                    *ngFor="let vehicle of profile.vehicles"
                    [routerLink]="['/vehicle', vehicle]"
                    class="block text-blue-500 hover:text-blue-700"
                  >
                    {{ vehicle }}
                  </a>
                </div>
              </div>
            </div>

            <div *ngIf="!profile.name && isMetaMaskAvailable" class="text-gray-600">
              Loading user profile...
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profile = {
    name: '',
    phone: '',
    vehicles: [] as string[]
  };
  isEditable = false;
  address: string | null = null;
  isMetaMaskAvailable = false;
  isLoading = false;
  private metaMaskSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  private userAddressSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private web3Service: Web3Service
  ) {}

  ngOnInit() {
    this.metaMaskSubscription = this.web3Service.isMetaMaskAvailable$.subscribe(
      isAvailable => {
        this.isMetaMaskAvailable = isAvailable;
      }
    );

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const address = params['address'];
      if (address) {
        this.address = address;
        this.isEditable = false;
        this.loadUserProfile(address);
      } else {
        this.userAddressSubscription = this.web3Service.userAddress$.subscribe(
          userAddress => {
            if (userAddress) {
              this.address = userAddress;
              this.isEditable = true;
              this.loadUserProfile(userAddress);
            }
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.metaMaskSubscription) {
      this.metaMaskSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.userAddressSubscription) {
      this.userAddressSubscription.unsubscribe();
    }
  }

  async loadUserProfile(address: string) {
    try {
      this.isLoading = true;
      const profile = await this.web3Service.getUserProfile(address);
      if (profile) {
        this.profile = {
          name: profile.name,
          phone: profile.phone,
          vehicles: profile.vehicles
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile() {
    try {
      this.isLoading = true;
      const signer = await this.web3Service.getSigner();
      const contract = new ethers.Contract(
        USER_PROFILE_CONTRACT_ADDRESS,
        USER_PROFILE_ABI,
        signer
      );
      const tx = await contract['updateUserProfile'](this.profile.name, this.profile.phone);
      await tx.wait();
      // Reload profile after update
      if (this.address) {
        await this.loadUserProfile(this.address);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      this.isLoading = false;
    }
  }
} 