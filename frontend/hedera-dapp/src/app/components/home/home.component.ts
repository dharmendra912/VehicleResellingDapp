import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800">
          <div class="container mx-auto px-4 py-16">
              <div class="max-w-3xl mx-auto text-center">
                  <h1 class="text-4xl md:text-5xl font-bold mb-6">Vehicle Lifecycle Platform</h1>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                      <a routerLink="/vehicle/register"
                         class="text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition duration-300">
                          Register Your Vehicle
                      </a>
                      <br>
                      <a routerLink="/vehicle/search"
                         class="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300">
                          Search Vehicle History
                      </a>
                  </div>
              </div>
          </div>
      </div>

      <!-- Features Section -->
      <div class="container mx-auto px-4 py-16">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                  <h3 class="text-xl font-semibold mb-3">Secure Ownership</h3>
                  <p class="text-gray-600">Immutable records on the blockchain ensure tamper-proof vehicle ownership
                      history</p>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                  <h3 class="text-xl font-semibold mb-3">Complete History</h3>
                  <p class="text-gray-600">Access comprehensive vehicle maintenance and ownership records in one
                      place</p>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                  <h3 class="text-xl font-semibold mb-3">Instant Verification</h3>
                  <p class="text-gray-600">Quick and reliable verification of vehicle authenticity and ownership
                      status</p>
              </div>
          </div>
      </div>

      <!-- User Sections -->
      <div class="container mx-auto px-4 py-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-blue-50 p-8 rounded-xl">
                  <h2 class="text-2xl font-bold text-gray-800 mb-4">For Vehicle Owners</h2>
                  <ul class="space-y-3 text-gray-600 mb-6">
                      <li class="flex items-center">
                          Register and manage your vehicles
                      </li>
                      <li class="flex items-center">
                          Track maintenance history
                      </li>
                      <li class="flex items-center">
                          Transfer ownership securely
                      </li>
                      <li class="flex items-center">
                          Access detailed vehicle reports
                      </li>
                  </ul>

              </div>

              <div class="bg-green-50 p-8 rounded-xl">
                  <h2 class="text-2xl font-bold text-gray-800 mb-4">For Buyers</h2>
                  <ul class="space-y-3 text-gray-600 mb-6">
                      <li class="flex items-center">
                          Verify vehicle authenticity
                      </li>
                      <li class="flex items-center">
                          Check complete ownership history
                      </li>
                      <li class="flex items-center">
                          View maintenance records
                      </li>
                      <li class="flex items-center">
                          Make informed purchase decisions
                      </li>
                  </ul>

              </div>
          </div>
      </div>

  `,
  styles: []
})
export class HomeComponent {}
