import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private _isConnected = new BehaviorSubject<boolean>(false);
  private _account = new BehaviorSubject<string>('');
  private readonly isBrowser: boolean;

  private readonly HEDERA_NETWORK = {
    chainId: '0x128', // 296 in hex
    chainName: 'Hedera Testnet',
    nativeCurrency: {
      name: 'HBAR',
      symbol: 'HBAR',
      decimals: 18
    },
    rpcUrls: ['https://testnet.hashio.io/api'],
    blockExplorerUrls: ['https://hashscan.io/testnet']
  };

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (this.isBrowser) {
      this.initializeProvider();
    }
  }

  get isConnected$() {
    return this._isConnected.asObservable();
  }

  get account$() {
    return this._account.asObservable();
  }

  private async initializeProvider() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          this._account.next(accounts[0]);
          this._isConnected.next(true);
        } else {
          this._account.next('');
          this._isConnected.next(false);
        }
      });
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) throw new Error('Web3 provider not initialized');

    try {
      await this.switchToHederaNetwork();
      const accounts = await this.provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        this._account.next(accounts[0]);
        this._isConnected.next(true);
        return accounts[0];
      }
      throw new Error('No accounts found');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  private async switchToHederaNetwork() {
    if (!this.provider) return;

    try {
      await this.provider.send('wallet_switchEthereumChain', [{ chainId: this.HEDERA_NETWORK.chainId }]);
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.provider.send('wallet_addEthereumChain', [this.HEDERA_NETWORK]);
        } catch (addError) {
          console.error('Error adding Hedera network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Hedera network:', error);
        throw error;
      }
    }
  }

  async getSigner() {
    if (!this.provider) {
      throw new Error('Web3 provider not initialized');
    }
    return this.provider.getSigner();
  }

  async checkNetwork() {
    if (!this.provider) return false;
    const network = await this.provider.getNetwork();
    return network.chainId === parseInt(this.HEDERA_NETWORK.chainId, 16);
  }
}
