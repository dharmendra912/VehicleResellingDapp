import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { ethers } from 'ethers';
import { USER_PROFILE_ABI, USER_PROFILE_CONTRACT_ADDRESS } from '../ABIs/UserProfile.abi';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
      chainId: string;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private isMetaMaskAvailableSubject = new BehaviorSubject<boolean>(false);
  private userAddressSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private provider: ethers.providers.Web3Provider | null = null;
  private readonly isBrowser: boolean;

  isMetaMaskAvailable$ = this.isMetaMaskAvailableSubject.asObservable();
  userAddress$ = this.userAddressSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (this.isBrowser) {
      this.checkMetaMaskAvailability();
      this.setupEventListeners();
    }
  }

  private checkMetaMaskAvailability() {
    if (!this.isBrowser) return;
    const isAvailable = typeof window.ethereum !== 'undefined';
    this.isMetaMaskAvailableSubject.next(isAvailable);
  }

  private setupEventListeners() {
    if (!this.isBrowser || !window.ethereum) return;
    
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.userAddressSubject.next(accounts[0] || null);
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }

  async connectWallet(): Promise<string> {
    if (!this.isBrowser || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      this.loadingSubject.next(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      this.userAddressSubject.next(address);
      return address;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async getProvider(): Promise<ethers.providers.Web3Provider> {
    if (!this.isBrowser) {
      throw new Error('Web3 is only available in browser environment');
    }

    if (!this.provider) {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    return this.provider;
  }

  async getSigner(): Promise<ethers.Signer> {
    const provider = await this.getProvider();
    return provider.getSigner();
  }

  async getUserProfile(address: string) {
    if (!this.isBrowser) {
      throw new Error('Web3 is only available in browser environment');
    }

    try {
      this.loadingSubject.next(true);
      const provider = await this.getProvider();
      const contract = new ethers.Contract(
        USER_PROFILE_CONTRACT_ADDRESS,
        USER_PROFILE_ABI,
        provider
      );
      
      const [name, phone, vehicles] = await Promise.all([
        contract['getUserName'](address),
        contract['getUserPhone'](address),
        contract['getUserVehicles'](address)
      ]);
      
      return { name, phone, vehicles };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async updateUserProfile(name: string, phone: string) {
    if (!this.isBrowser) {
      throw new Error('Web3 is only available in browser environment');
    }

    try {
      this.loadingSubject.next(true);
      const signer = await this.getSigner();
      const contract = new ethers.Contract(
        USER_PROFILE_CONTRACT_ADDRESS,
        USER_PROFILE_ABI,
        signer
      );
      const tx = await contract['updateUserProfile'](name, phone);
      await tx.wait();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
