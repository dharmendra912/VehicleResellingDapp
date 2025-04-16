import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-vehicle-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-md mx-auto">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Search Vehicle</h2>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Registration Number</label>
            <input
              [(ngModel)]="searchRegNo"
              (keyup.enter)="searchVehicle()"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter vehicle registration number"
            />
          </div>

          <button
            (click)="searchVehicle()"
            [disabled]="!searchRegNo || isLoading"
            class="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded w-full"
          >
            <span *ngIf="!isLoading">Search Vehicle</span>
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm"></span>
          </button>

          <div *ngIf="error" class="mt-4 text-red-500">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VehicleSearchComponent {
  searchRegNo = '';
  isLoading = false;
  error = '';

  constructor(
    private router: Router,
    private dialogService: DialogService
  ) {}

  searchVehicle() {
    if (!this.searchRegNo) {
      this.error = 'Please enter a registration number';
      return;
    }

    this.isLoading = true;
    this.error = '';

    // Navigate to vehicle details page
    this.router.navigate(['/vehicle', this.searchRegNo])
      .catch(error => {
        this.error = 'Failed to find vehicle. Please check the registration number and try again.';
        console.error('Navigation error:', error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
