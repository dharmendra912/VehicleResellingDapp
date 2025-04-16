import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Web3Service} from '../../services/web3.service';
import {Subscription} from 'rxjs';
import {ethers} from 'ethers';
import {USER_PROFILE_ABI, USER_PROFILE_CONTRACT_ADDRESS} from '../../ABIs/UserProfile.abi';

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
  ) {
  }

  ngOnInit() {
    console.log("User Profile");
    this.metaMaskSubscription = this.web3Service.isMetaMaskAvailable$.subscribe(
      isAvailable => {
        this.isMetaMaskAvailable = isAvailable;
      }
    );

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const address = params['address'];
      console.log(address);
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
      console.log('Loading profile for address:', address);

      const currentAddress = await this.web3Service.userAddress$.toPromise();
      if (!currentAddress) {
        throw new Error('Please connect your wallet first');
      } else {
        console.log("wallet is connected")
      }

      const profile = await this.web3Service.getUserProfile(address);
      console.log('Profile loaded:', profile);

      if (profile) {
        this.profile = {
          name: profile.name,
          phone: profile.phone,
          vehicles: profile.vehicles
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // You might want to show this error to the user
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile() {
    try {
      this.isLoading = true;
      console.log('Updating profile...');

      // Ensure we have a connected wallet
      const currentAddress = await this.web3Service.userAddress$.toPromise();
      if (!currentAddress) {
        throw new Error('Please connect your wallet first');
      }

      // Get the signer
      const signer = await this.web3Service.getSigner();
      console.log('Got signer:', signer);

      // Initialize contract with signer
      const contract = new ethers.Contract(
        USER_PROFILE_CONTRACT_ADDRESS,
        USER_PROFILE_ABI,
        signer
      );
      console.log('Contract initialized');

      // Perform the update
      const tx = await contract['updateUserProfile'](this.profile.name, this.profile.phone);
      console.log('Transaction sent:', tx);

      await tx.wait();
      console.log('Transaction confirmed');

      // Reload profile after update
      if (this.address) {
        await this.loadUserProfile(this.address);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show this error to the user
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}
