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
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
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