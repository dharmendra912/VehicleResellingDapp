import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800">Vehicle Registry</h1>
            <p class="text-gray-600">Search for vehicles or owners</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Search Vehicle</label>
              <div class="flex">
                <input
                  [(ngModel)]="vehicleRegNo"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Enter vehicle registration number"
                />
                <button
                  (click)="searchVehicle()"
                  class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Search
                </button>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Search Owner</label>
              <div class="flex">
                <input
                  [(ngModel)]="ownerAddress"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Enter owner address"
                />
                <button
                  (click)="searchOwner()"
                  class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  vehicleRegNo = '';
  ownerAddress = '';

  constructor(private router: Router) {}

  searchVehicle() {
    if (this.vehicleRegNo) {
      this.router.navigate(['/vehicle', this.vehicleRegNo]);
    }
  }

  searchOwner() {
    if (this.ownerAddress) {
      this.router.navigate(['/user/profile', this.ownerAddress]);
    }
  }
} 