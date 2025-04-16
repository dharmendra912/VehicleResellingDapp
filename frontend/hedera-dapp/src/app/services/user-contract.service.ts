import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { LoadingService } from './loading.service';
import { DialogService } from './dialog.service';
import { Web3Service } from './web3.service';
import { USER_PROFILE_ABI, USER_PROFILE_CONTRACT_ADDRESS } from '../ABIs/UserProfile.abi';

@Injectable({
  providedIn: 'root'
})
export class UserContractService {
  private userContract: ethers.Contract | null = null;

  constructor(
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private dialogService: DialogService
  ) {}

  private async getContract() {
    if (!this.userContract) {
      const provider = await this.web3Service.getProvider();
      if (!provider) throw new Error('Provider not initialized');
      
      this.userContract = new ethers.Contract(
        USER_PROFILE_CONTRACT_ADDRESS,
        USER_PROFILE_ABI,
        provider
      );
      
      const signer = await this.web3Service.getSigner();
      if (signer) {
        this.userContract = this.userContract.connect(signer);
      }
    }
    return this.userContract;
  }

  // Create or update user profile
  async updateUserProfile(name: string, phone: string): Promise<void> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const tx = await contract['updateUserProfile'](name, phone);
      await tx.wait();
      this.dialogService.showSuccess(
        'User Profile',
        'User profile updated successfully!'
      );
    } catch (error) {
      this.handleError(error, 'User Profile Update');
    } finally {
      this.loadingService.hide();
    }
  }

  // Retrieve user profile details
  async getUserProfile(userAddr: string): Promise<{ name: string; phone: string; vehicles: string[] } | null> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const [name, phone, vehicles] = await contract['getUserProfile'](userAddr);
      return { name, phone, vehicles };
    } catch (error) {
      this.handleError(error, 'Get User Profile');
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  // Getter for the wallet address associated with the user profile
  async getUserWallet(userAddr: string): Promise<string | null> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getUserWallet'](userAddr);
    } catch (error) {
      this.handleError(error, 'Get User Wallet');
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  // Getter for the user's name
  async getUserName(userAddr: string): Promise<string> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getUserName'](userAddr);
    } catch (error) {
      this.handleError(error, 'Get User Name');
      return '';
    } finally {
      this.loadingService.hide();
    }
  }

  // Getter for the user's phone number
  async getUserPhone(userAddr: string): Promise<string> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getUserPhone'](userAddr);
    } catch (error) {
      this.handleError(error, 'Get User Phone');
      return '';
    } finally {
      this.loadingService.hide();
    }
  }

  // Getter for the array of vehicle registration numbers
  async getUserVehicles(userAddr: string): Promise<string[]> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getUserVehicles'](userAddr);
    } catch (error) {
      this.handleError(error, 'Get User Vehicles');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  private handleError(error: any, operation: string) {
    console.error(`${operation} error:`, error);
    this.dialogService.showError(
      operation,
      error.message || 'An error occurred'
    );
  }
} 