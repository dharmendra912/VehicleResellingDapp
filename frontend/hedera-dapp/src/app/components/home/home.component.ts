import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Vehicle Lifecycle Platform</h1>
          <p class="text-xl mb-8">Empowering vehicle owners and buyers with transparent, secure, and decentralized vehicle history management</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/vehicle/register" class="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition duration-300">
              Register Your Vehicle
            </a>
            <a routerLink="/vehicle/search" class="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300">
              Search Vehicle History
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Platform?</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">Experience the future of vehicle ownership management with our secure and transparent platform</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <div class="text-blue-600 text-4xl mb-4">🔒</div>
          <h3 class="text-xl font-semibold mb-3">Secure Ownership</h3>
          <p class="text-gray-600">Immutable records on the blockchain ensure tamper-proof vehicle ownership history</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <div class="text-blue-600 text-4xl mb-4">📊</div>
          <h3 class="text-xl font-semibold mb-3">Complete History</h3>
          <p class="text-gray-600">Access comprehensive vehicle maintenance and ownership records in one place</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <div class="text-blue-600 text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-semibold mb-3">Instant Verification</h3>
          <p class="text-gray-600">Quick and reliable verification of vehicle authenticity and ownership status</p>
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
              <span class="text-blue-600 mr-2">✓</span>
              Register and manage your vehicles
            </li>
            <li class="flex items-center">
              <span class="text-blue-600 mr-2">✓</span>
              Track maintenance history
            </li>
            <li class="flex items-center">
              <span class="text-blue-600 mr-2">✓</span>
              Transfer ownership securely
            </li>
            <li class="flex items-center">
              <span class="text-blue-600 mr-2">✓</span>
              Access detailed vehicle reports
            </li>
          </ul>
          <a routerLink="/vehicle/register" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Get Started
          </a>
        </div>

        <div class="bg-green-50 p-8 rounded-xl">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">For Buyers</h2>
          <ul class="space-y-3 text-gray-600 mb-6">
            <li class="flex items-center">
              <span class="text-green-600 mr-2">✓</span>
              Verify vehicle authenticity
            </li>
            <li class="flex items-center">
              <span class="text-green-600 mr-2">✓</span>
              Check complete ownership history
            </li>
            <li class="flex items-center">
              <span class="text-green-600 mr-2">✓</span>
              View maintenance records
            </li>
            <li class="flex items-center">
              <span class="text-green-600 mr-2">✓</span>
              Make informed purchase decisions
            </li>
          </ul>
          <a routerLink="/vehicle/search" class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Search Vehicles
          </a>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gray-900 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-6">Ready to Experience the Future of Vehicle Management?</h2>
          <p class="text-xl mb-8">Join thousands of users who trust our platform for secure and transparent vehicle history management</p>
          <a routerLink="/vehicle/register" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
