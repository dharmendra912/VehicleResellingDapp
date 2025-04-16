import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleContractService } from '../../services/vehicle-contract.service';
import { Web3Service } from '../../services/web3.service';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <div *ngIf="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading vehicle details...</p>
              </div>

              <div *ngIf="!isLoading && !error && vehicle" class="vehicle-details">
                <h5 class="card-title mb-4">Vehicle Details</h5>

                <div class="mb-4">
                  <h6 class="text-muted mb-3">Basic Information</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Registration Number:</strong> {{ vehicle.regNo }}</p>
                      <p><strong>Year of Manufacturing:</strong> {{ vehicle.yearOfManufacturing }}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Current Owner:</strong>
                        <a [routerLink]="['/user/profile']" [queryParams]="{ address: vehicle.currentOwner }" class="text-decoration-none">
                          {{ vehicle.currentOwner }}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h6 class="text-muted mb-3">Maintenance Records</h6>
                  <div *ngIf="maintenanceHistory.length === 0" class="text-muted">
                    No maintenance records found
                  </div>
                  <div *ngIf="maintenanceHistory.length > 0" class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Service Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let record of maintenanceHistory">
                          <td>{{ record.date | date }}</td>
                          <td>{{ record.maintenanceType }}</td>
                          <td>{{ record.serviceProvider }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mb-4">
                  <h6 class="text-muted mb-3">Insurance Information</h6>
                  <div *ngIf="insuranceHistory.length === 0" class="text-muted">
                    No insurance information found
                  </div>
                  <div *ngIf="insuranceHistory.length > 0" class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Reference Number</th>
                          <th>Document Hash</th>
                          <th>Document Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let info of insuranceHistory">
                          <td>{{ info.insuranceRef }}</td>
                          <td>{{ info.docHash }}</td>
                          <td>
                            <a [href]="info.docLink" target="_blank" class="text-decoration-none">
                              View Document
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mb-4">
                  <h6 class="text-muted mb-3">Accident Records</h6>
                  <div *ngIf="accidentHistory.length === 0" class="text-muted">
                    No accident records found
                  </div>
                  <div *ngIf="accidentHistory.length > 0" class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Report Document Hash</th>
                          <th>Report Document Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let record of accidentHistory">
                          <td>{{ record.date | date }}</td>
                          <td>{{ record.reportDocHash }}</td>
                          <td>
                            <a [href]="record.reportDocLink" target="_blank" class="text-decoration-none">
                              View Report
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mb-4">
                  <h6 class="text-muted mb-3">Ownership History</h6>
                  <div *ngIf="pastOwners.length === 0" class="text-muted">
                    No past owners found
                  </div>
                  <div *ngIf="pastOwners.length > 0" class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Owner Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let owner of pastOwners">
                          <td>
                            <a [routerLink]="['/user/profile']" [queryParams]="{ address: owner }" class="text-decoration-none">
                              {{ owner }}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mb-4">
                  <h6 class="text-muted mb-3">Resale History</h6>
                  <div *ngIf="resellHistory.length === 0" class="text-muted">
                    No resale records found
                  </div>
                  <div *ngIf="resellHistory.length > 0" class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let amount of resellHistory">
                          <td>{{ amount | currency }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div *ngIf="!isLoading && error" class="alert alert-danger">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
  vehicle: any = null;
  maintenanceHistory: any[] = [];
  insuranceHistory: any[] = [];
  accidentHistory: any[] = [];
  pastOwners: string[] = [];
  resellHistory: number[] = [];
  isLoading = true;
  error: string | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private web3Service: Web3Service,
    private vehicleContractService: VehicleContractService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const regNo = params['regNo'];
      if (regNo) {
        this.loadVehicleDetails(regNo);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadVehicleDetails(regNo: string) {
    try {
      this.isLoading = true;
      this.error = null;
      this.vehicle = null;
      this.maintenanceHistory = [];
      this.insuranceHistory = [];
      this.accidentHistory = [];
      this.pastOwners = [];
      this.resellHistory = [];

      const details = await this.vehicleContractService.getVehicleDetails(regNo);
      if (!details) {
        this.error = 'Vehicle not found';
        return;
      }

      this.vehicle = details;

      // Load all histories
      this.maintenanceHistory = await this.vehicleContractService.getMaintenanceHistory(regNo);
      this.insuranceHistory = await this.vehicleContractService.getInsuranceHistory(regNo);
      this.accidentHistory = await this.vehicleContractService.getAccidentHistory(regNo);
      this.pastOwners = await this.vehicleContractService.getPastOwnerHistory(regNo);
      this.resellHistory = await this.vehicleContractService.getResellHistory(regNo);
    } catch (error) {
      console.error('Error loading vehicle details:', error);
      this.error = 'Failed to load vehicle details';
    } finally {
      this.isLoading = false;
    }
  }
}
