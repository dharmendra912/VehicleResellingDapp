import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private web3Service: Web3Service) {}

  async ngOnInit() {
    try {
      await this.web3Service.checkNetwork();
    } catch (error) {
      console.error('Error checking network:', error);
    }
  }
}
