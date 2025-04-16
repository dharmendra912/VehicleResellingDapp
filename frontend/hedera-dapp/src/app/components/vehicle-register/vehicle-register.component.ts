import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Web3Service } from '../../services/web3.service';
import { VehicleContractService } from '../../services/vehicle-contract.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-vehicle-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-4">Register New Vehicle</h5>

              <form (ngSubmit)="registerVehicle()" #vehicleForm="ngForm">
                <div class="mb-3">
                  <label for="regNo" class="form-label">Registration Number&nbsp;</label>
                  <input
                    type="text"
                    class="form-control"
                    id="regNo"
                    name="regNo"
                    [(ngModel)]="vehicle.regNo"
                    required
                    placeholder="Enter registration number"
                  >
                </div>

                <div class="mb-3">
                  <label for="yearOfManufacturing" class="form-label">Year of Manufacturing&nbsp;</label>
                  <input
                    type="number"
                    class="form-control"
                    id="yearOfManufacturing"
                    name="yearOfManufacturing"
                    [(ngModel)]="vehicle.yearOfManufacturing"
                    required
                    min="1900"
                    max="2025"
                    placeholder="Enter manufacturing year"
                  >
                </div>

                <div class="d-grid gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="!vehicleForm.valid || isSubmitting"
                  >
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isSubmitting ? 'Registering...' : 'Register Vehicle' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VehicleRegisterComponent implements OnInit {
  vehicle = {
    regNo: '',
    yearOfManufacturing: 0
  };
  isSubmitting = false;

  constructor(
    private web3Service: Web3Service,
    private vehicleContractService: VehicleContractService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {}

  async registerVehicle() {
    if (!this.vehicle.regNo || !this.vehicle.yearOfManufacturing) {
      this.dialogService.showError('Error', 'Please fill in all required fields');
      return;
    }

    try {
      this.isSubmitting = true;
      await this.vehicleContractService.registerVehicle(
        this.vehicle.regNo,
        this.vehicle.yearOfManufacturing
      );

      this.dialogService.showSuccess(
        'Success',
        'Vehicle registered successfully!'
      );

      // Navigate to vehicle details page
      this.router.navigate(['/vehicle', this.vehicle.regNo]);
    } catch (error) {
      console.error('Error registering vehicle:', error);
      this.dialogService.showError(
        'Error',
        'Failed to register vehicle. Please try again.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
