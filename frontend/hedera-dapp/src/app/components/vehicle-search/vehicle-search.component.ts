import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-vehicle-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-search.component.html',
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
