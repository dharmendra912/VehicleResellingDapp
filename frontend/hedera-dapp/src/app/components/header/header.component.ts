import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <a routerLink="/" class="text-xl font-bold">Vehicle Registry</a>
          <nav class="flex space-x-4">
            <a routerLink="/vehicle/register" class="hover:text-gray-300">Register Vehicle</a>
            <a routerLink="/user/profile" class="hover:text-gray-300">My Profile</a>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <div *ngIf="userAddress" class="text-sm">
            <div>Address: {{ userAddress }}</div>
            <div *ngIf="userName">Name: {{ userName }}</div>
          </div>
          <button
            *ngIf="!userAddress"
            (click)="connectWallet()"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  userAddress: string | null = null;
  userName: string | null = null;

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.contractService.userAddress$.subscribe(address => {
      this.userAddress = address;
      if (address) {
        this.loadUserProfile(address);
      }
    });
  }

  async connectWallet() {
    try {
      await this.contractService.connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  }

  async loadUserProfile(address: string) {
    try {
      const profile = await this.contractService.getUserProfile(address);
      this.userName = profile.name || null;
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
}
