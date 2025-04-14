import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-hedera-connector',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <nav class="navbar">
        <h1>Hedera DApp</h1>
        <button
          (click)="connectWallet()"
          [class.connected]="isConnected"
          class="connect-button">
          {{ isConnected ? 'Connected: ' + shortAddress : 'Connect Wallet' }}
        </button>
      </nav>

      <div class="content" *ngIf="isConnected">
        <h2>Welcome to Hedera DApp</h2>
        <p>Your account: {{ account }}</p>
        <!-- Add more components here -->
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .connect-button {
      padding: 10px 20px;
      border-radius: 5px;
      border: none;
      background-color: #0f2e7c;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .connect-button:hover {
      background-color: #1a44b3;
    }
    .connect-button.connected {
      background-color: #28a745;
    }
    .content {
      padding: 20px;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
  `],
  styleUrl: './hedera-connector.component.scss'
})
export class HederaConnectorComponent {

  isConnected = false;
  account = '';

  constructor(private web3Service: Web3Service) {
  }

  ngOnInit() {
    this.web3Service.isConnected$.subscribe(
      connected => this.isConnected = connected
    );
    this.web3Service.account$.subscribe(
      account => this.account = account
    );
  }


  get shortAddress(): string {
    if (!this.account) return '';
    return this.account.substring(0, 6) + '...' + this.account.substring(this.account.length - 4);
  }

  async connectWallet() {
    try {
      await this.web3Service.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // You might want to add a proper error handling UI here
    }
  }

}
