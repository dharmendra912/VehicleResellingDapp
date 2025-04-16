import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">Vehicle Lifecycle Platform</h1>
            <p class="text-gray-600 mb-6">A decentralized platform for managing vehicle ownership and history</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-gray-800 mb-3">For Vehicle Owners</h2>
              <ul class="space-y-2 text-gray-600">
                <li>Register your vehicles</li>
                <li>View vehicle history</li>
                <li>Manage ownership records</li>
              </ul>
              <a routerLink="/vehicle/register" class="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Register Vehicle
              </a>
            </div>

            <div class="bg-green-50 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-gray-800 mb-3">For Buyers</h2>
              <ul class="space-y-2 text-gray-600">
                <li>Search vehicle history</li>
                <li>Verify ownership</li>
                <li>Check maintenance records</li>
              </ul>
              <a routerLink="/vehicle/search" class="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Search Vehicle
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
