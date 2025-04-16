import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ethers } from 'ethers';

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
  private isBrowser = typeof window !== 'undefined';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private isMetaMaskAvailableSubject = new BehaviorSubject<boolean>(false);
  private userAddressSubject = new BehaviorSubject<string | null>(null);
  
  loading$ = this.loadingSubject.asObservable();
  isMetaMaskAvailable$ = this.isMetaMaskAvailableSubject.asObservable();
  userAddress$ = this.userAddressSubject.asObservable();

  constructor() {
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
    if (!this.isBrowser) {
      throw new Error('Web3 is only available in browser environment');
    }

    try {
      this.loadingSubject.next(true);
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
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

  async getProvider() {
    if (!this.isBrowser) {
      throw new Error('Web3 is only available in browser environment');
    }

    try {
      this.loadingSubject.next(true);
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      console.error('Error getting provider:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async getSigner() {
    if (!this.isBrowser) {
      throw new Error('Web3 is only available in browser environment');
    }

    try {
      this.loadingSubject.next(true);
      const provider = await this.getProvider();
      return provider.getSigner();
    } catch (error) {
      console.error('Error getting signer:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
