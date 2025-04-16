import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from './dialog.service';
import { LoadingService } from './loading.service';
import { USER_PROFILE_ABI, USER_PROFILE_CONTRACT_ADDRESS } from '../ABIs/UserProfile.abi';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private userContract: ethers.Contract | null = null;
  
  private userAddressSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private isMetaMaskAvailableSubject = new BehaviorSubject<boolean>(false);

  userAddress$ = this.userAddressSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  isMetaMaskAvailable$ = this.isMetaMaskAvailableSubject.asObservable();

  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService
  ) {
    this.checkMetaMaskAvailability();
  }

  private checkMetaMaskAvailability() {
    const isAvailable = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    this.isMetaMaskAvailableSubject.next(isAvailable);
  }

  async connectWallet(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      this.provider = provider;
      this.signer = signer;
      
      // Initialize user contract
      this.userContract = new ethers.Contract(
        USER_PROFILE_CONTRACT_ADDRESS,
        USER_PROFILE_ABI,
        this.signer
      );
      
      // Check if user exists and initialize if new
      await this.initializeUserIfNeeded(address);
      
      this.userAddressSubject.next(address);
      this.dialogService.showSuccess('Wallet Connection', 'Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      this.dialogService.showError('Wallet Connection', error instanceof Error ? error.message : 'Failed to connect wallet');
      this.userAddressSubject.next(null);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  private async initializeUserIfNeeded(address: string) {
    try {
      if (!this.userContract) return;
      
      // Check if user exists by calling users mapping
      const userData = await this.userContract['users'](address);
      const isNewUser = userData.walletAddress === '0x0000000000000000000000000000000000000000';
      
      if (isNewUser) {
        console.log('New user detected, initializing profile...');
        // Call getAndSaveUserProfile in background
        this.userContract['getUserProfile'](address).catch((error: unknown) => {
          console.error('Error initializing user profile:', error);
        });
        
        // Show welcome dialog for new users
        this.dialogService.showSuccess(
          'Welcome!', 
          'Thank you for joining. Please complete your profile to get started.'
        );
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  }

  async disconnectWallet(): Promise<void> {
    try {
      // Clear all local state
      this.provider = null;
      this.signer = null;
      this.userContract = null;
      this.userAddressSubject.next(null);
      
      // Reset MetaMask connection
      if (window.ethereum) {
        // Request MetaMask to disconnect
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{
            eth_accounts: {}
          }]
        });
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }

  async getProvider(): Promise<ethers.providers.Web3Provider | null> {
    return this.provider;
  }

  async getSigner(): Promise<ethers.Signer | null> {
    return this.signer;
  }
}
