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

  private async ensureUserContract() {
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

  async updateUserProfile(name: string, phone: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureUserContract();
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

  async getUserProfile(address: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureUserContract();
      const [name, phone, vehicles] = await contract['getUserProfile'](address);
      return { name, phone, vehicles };
    } catch (error) {
      this.handleError(error, 'Get User Profile');
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  async getUserName(address: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureUserContract();
      const name = await contract['getUserName'](address);
      return name;
    } catch (error) {
      this.handleError(error, 'Get User Name');
      return '';
    } finally {
      this.loadingService.hide();
    }
  }

  async getUserPhone(address: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureUserContract();
      const phone = await contract['getUserPhone'](address);
      return phone;
    } catch (error) {
      this.handleError(error, 'Get User Phone');
      return '';
    } finally {
      this.loadingService.hide();
    }
  }

  async getUserVehicles(address: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureUserContract();
      const vehicles = await contract['getUserVehicles'](address);
      return vehicles;
    } catch (error) {
      this.handleError(error, 'Get User Vehicles');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async getUserWallet(address: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureUserContract();
      const wallet = await contract['getUserWallet'](address);
      return wallet;
    } catch (error) {
      this.handleError(error, 'Get User Wallet');
      return null;
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