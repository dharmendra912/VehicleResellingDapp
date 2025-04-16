import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
      <!-- Hero Section -->
      <div class="bg-primary">
          <div class="container mx-auto px-4 py-16">
              <div class="max-w-3xl mx-auto text-center">
                  <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white">AutoTrust - A Vehicle Lifecycle Platform</h1>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                      <a routerLink="/vehicle/register"
                         class="btn btn-outline-light btn-lg">
                          Register Your Vehicle
                      </a>
                      <a routerLink="/vehicle/search"
                         class="btn btn-outline-light btn-lg">
                          Search Vehicle History
                      </a>
                  </div>
              </div>
          </div>
      </div>

      <!-- Features Section -->
      <div class="container mx-auto px-4 py-16">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="card shadow-sm">
                  <div class="card-body">
                      <h3 class="card-title text-dark">Secure Ownership</h3>
                      <p class="card-text text-muted">Immutable records on the blockchain ensure tamper-proof vehicle ownership history</p>
                  </div>
              </div>
              <div class="card shadow-sm">
                  <div class="card-body">
                      <h3 class="card-title text-dark">Complete History</h3>
                      <p class="card-text text-muted">Access comprehensive vehicle maintenance and ownership records in one place</p>
                  </div>
              </div>
              <div class="card shadow-sm">
                  <div class="card-body">
                      <h3 class="card-title text-dark">Instant Verification</h3>
                      <p class="card-text text-muted">Quick and reliable verification of vehicle authenticity and ownership status</p>
                  </div>
              </div>
          </div>
      </div>

      <!-- User Sections -->
      <div class="container mx-auto px-4 py-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="card shadow-sm">
                  <div class="card-body">
                      <h2 class="card-title text-dark mb-4">For Vehicle Owners</h2>
                      <ul class="list-unstyled text-muted mb-0">
                          <li class="mb-2">Register and manage your vehicles</li>
                          <li class="mb-2">Track maintenance history</li>
                          <li class="mb-2">Transfer ownership securely</li>
                          <li>Access detailed vehicle reports</li>
                      </ul>
                  </div>
              </div>

              <div class="card shadow-sm">
                  <div class="card-body">
                      <h2 class="card-title text-dark mb-4">For Buyers</h2>
                      <ul class="list-unstyled text-muted mb-0">
                          <li class="mb-2">Verify vehicle authenticity</li>
                          <li class="mb-2">Check complete ownership history</li>
                          <li class="mb-2">View maintenance records</li>
                          <li>Make informed purchase decisions</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: []
})
export class HomeComponent {}
