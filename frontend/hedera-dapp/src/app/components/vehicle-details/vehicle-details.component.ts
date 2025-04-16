import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { VehicleContractService } from '../../services/vehicle-contract.service';
import { Web3Service } from '../../services/web3.service';
import { LoadingService } from '../../services/loading.service';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';

interface VehicleDetails {
  regNo: string;
  currentOwner: string;
  pastOwners: string[];
  yearOfManufacturing: number;
  maintenanceCount: number;
  insuranceCount: number;
  accidentCount: number;
  resellCount: number;
}

interface Maintenance {
  date: number;
  maintenanceType: string;
  serviceProvider: string;
}

interface Insurance {
  insuranceRef: string;
  docHash: string;
  docLink: string;
}

interface Accident {
  date: number;
  reportDocHash: string;
  reportDocLink: string;
}

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Vehicle Details</h1>
            <p class="text-sm text-gray-600">Registration Number: {{ vehicleDetails?.regNo }}</p>
          </div>

          <!-- Basic Details -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Registration Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ vehicleDetails?.regNo }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Year of Manufacturing</label>
                <p class="mt-1 text-sm text-gray-900">{{ vehicleDetails?.yearOfManufacturing }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Current Owner</label>
                <p class="mt-1 text-sm text-gray-900">{{ vehicleDetails?.currentOwner }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Number of Past Owners</label>
                <p class="mt-1 text-sm text-gray-900">{{ vehicleDetails?.pastOwners?.length }}</p>
              </div>
            </div>
          </div>

          <!-- Maintenance History -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Maintenance History</h2>
              <button *ngIf="isOwner" 
                      (click)="showAddMaintenance = true"
                      class="btn btn-primary btn-sm">
                Add Maintenance
              </button>
            </div>
            
            <!-- Add Maintenance Form -->
            <div *ngIf="showAddMaintenance" class="mb-4 p-4 border rounded-lg">
              <form (ngSubmit)="addMaintenance()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" [(ngModel)]="newMaintenance.date" name="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Maintenance Type</label>
                  <input type="text" [(ngModel)]="newMaintenance.maintenanceType" name="maintenanceType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Service Provider</label>
                  <input type="text" [(ngModel)]="newMaintenance.serviceProvider" name="serviceProvider" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" (click)="showAddMaintenance = false" class="btn btn-outline-secondary btn-sm">Cancel</button>
                  <button type="submit" [disabled]="isLoading" class="btn btn-primary btn-sm">
                    {{ isLoading ? 'Adding...' : 'Add Maintenance' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Maintenance List -->
            <div *ngIf="maintenanceHistory.length > 0" class="space-y-4">
              <div *ngFor="let maintenance of maintenanceHistory" class="border rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Date</label>
                    <p class="mt-1 text-sm text-gray-900">{{ maintenance.date | date }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <p class="mt-1 text-sm text-gray-900">{{ maintenance.maintenanceType }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Service Provider</label>
                    <p class="mt-1 text-sm text-gray-900">{{ maintenance.serviceProvider }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="maintenanceHistory.length === 0" class="text-center py-4 text-gray-500">
              No maintenance records found
            </div>
          </div>

          <!-- Insurance History -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Insurance History</h2>
              <button *ngIf="isOwner" 
                      (click)="showAddInsurance = true"
                      class="btn btn-primary btn-sm">
                Add Insurance
              </button>
            </div>

            <!-- Add Insurance Form -->
            <div *ngIf="showAddInsurance" class="mb-4 p-4 border rounded-lg">
              <form (ngSubmit)="addInsurance()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Insurance Reference</label>
                  <input type="text" [(ngModel)]="newInsurance.insuranceRef" name="insuranceRef" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Document Hash</label>
                  <input type="text" [(ngModel)]="newInsurance.docHash" name="docHash" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Document Link</label>
                  <input type="text" [(ngModel)]="newInsurance.docLink" name="docLink" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" (click)="showAddInsurance = false" class="btn btn-outline-secondary btn-sm">Cancel</button>
                  <button type="submit" [disabled]="isLoading" class="btn btn-primary btn-sm">
                    {{ isLoading ? 'Adding...' : 'Add Insurance' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Insurance List -->
            <div *ngIf="insuranceHistory.length > 0" class="space-y-4">
              <div *ngFor="let insurance of insuranceHistory" class="border rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Reference</label>
                    <p class="mt-1 text-sm text-gray-900">{{ insurance.insuranceRef }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Document Hash</label>
                    <p class="mt-1 text-sm text-gray-900">{{ insurance.docHash }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Document Link</label>
                    <a [href]="insurance.docLink" target="_blank" class="text-blue-600 hover:text-blue-800">View Document</a>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="insuranceHistory.length === 0" class="text-center py-4 text-gray-500">
              No insurance records found
            </div>
          </div>

          <!-- Accident History -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Accident History</h2>
              <button *ngIf="isOwner" 
                      (click)="showAddAccident = true"
                      class="btn btn-primary btn-sm">
                Add Accident
              </button>
            </div>

            <!-- Add Accident Form -->
            <div *ngIf="showAddAccident" class="mb-4 p-4 border rounded-lg">
              <form (ngSubmit)="addAccident()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" [(ngModel)]="newAccident.date" name="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Report Document Hash</label>
                  <input type="text" [(ngModel)]="newAccident.reportDocHash" name="reportDocHash" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Report Document Link</label>
                  <input type="text" [(ngModel)]="newAccident.reportDocLink" name="reportDocLink" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" (click)="showAddAccident = false" class="btn btn-outline-secondary btn-sm">Cancel</button>
                  <button type="submit" [disabled]="isLoading" class="btn btn-primary btn-sm">
                    {{ isLoading ? 'Adding...' : 'Add Accident' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Accident List -->
            <div *ngIf="accidentHistory.length > 0" class="space-y-4">
              <div *ngFor="let accident of accidentHistory" class="border rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Date</label>
                    <p class="mt-1 text-sm text-gray-900">{{ accident.date | date }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Report Document Hash</label>
                    <p class="mt-1 text-sm text-gray-900">{{ accident.reportDocHash }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Report Document Link</label>
                    <a [href]="accident.reportDocLink" target="_blank" class="text-blue-600 hover:text-blue-800">View Report</a>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="accidentHistory.length === 0" class="text-center py-4 text-gray-500">
              No accident records found
            </div>
          </div>

          <!-- Resell Vehicle -->
          <div *ngIf="isOwner" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Resell Vehicle</h2>
            <form (ngSubmit)="resellVehicle()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">New Owner Address</label>
                <input type="text" [(ngModel)]="newOwnerAddress" name="newOwnerAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Resell Amount (in ETH)</label>
                <input type="number" [(ngModel)]="resellAmount" name="resellAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
              </div>
              <div class="flex justify-end">
                <button type="submit" [disabled]="isLoading" class="btn btn-primary">
                  {{ isLoading ? 'Processing...' : 'Resell Vehicle' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
  vehicleDetails: VehicleDetails | null = null;
  maintenanceHistory: Maintenance[] = [];
  insuranceHistory: Insurance[] = [];
  accidentHistory: Accident[] = [];
  isOwner = false;
  isLoading = false;
  showAddMaintenance = false;
  showAddInsurance = false;
  showAddAccident = false;
  newMaintenance = { date: 0, maintenanceType: '', serviceProvider: '' };
  newInsurance = { insuranceRef: '', docHash: '', docLink: '' };
  newAccident = { date: 0, reportDocHash: '', reportDocLink: '' };
  newOwnerAddress = '';
  resellAmount = 0;
  private userAddressSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private vehicleContractService: VehicleContractService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('VehicleDetailsComponent: ngOnInit called');
    
    // First check the current route parameters
    const regNo = this.route.snapshot.paramMap.get('regNo');
    console.log('VehicleDetailsComponent: Snapshot regNo:', regNo);
    
    if (regNo) {
      this.loadVehicleDetails(regNo);
    }

    // Then subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const newRegNo = params.get('regNo');
      console.log('VehicleDetailsComponent: Route params changed:', { newRegNo });
      if (newRegNo) {
        this.loadVehicleDetails(newRegNo);
      }
    });

    // Subscribe to wallet connection changes
    this.userAddressSubscription = this.web3Service.userAddress$.subscribe(address => {
      console.log('VehicleDetailsComponent: User address changed:', address);
      if (address && this.vehicleDetails) {
        this.isOwner = address.toLowerCase() === this.vehicleDetails.currentOwner.toLowerCase();
        console.log('VehicleDetailsComponent: Owner status updated:', { isOwner: this.isOwner, currentOwner: this.vehicleDetails.currentOwner });
      }
      
      // Reload vehicle details when user address changes
      const currentRegNo = this.route.snapshot.paramMap.get('regNo');
      if (currentRegNo) {
        console.log('VehicleDetailsComponent: Reloading vehicle details after user address change');
        this.loadVehicleDetails(currentRegNo);
      }
    });
  }

  ngOnDestroy() {
    if (this.userAddressSubscription) {
      this.userAddressSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private async loadVehicleDetails(regNo: string) {
    console.log('VehicleDetailsComponent: Loading vehicle details for:', regNo);
    try {
      this.loadingService.show();
      
      // Load basic vehicle details
      console.log('VehicleDetailsComponent: Fetching basic vehicle details...');
      this.vehicleDetails = await this.vehicleContractService.getVehicleDetails(regNo);
      console.log('VehicleDetailsComponent: Basic details received:', this.vehicleDetails);
      
      if (!this.vehicleDetails) {
        this.dialogService.showError('Vehicle Details', 'Vehicle not found');
        return;
      }
      
      // Load history data
      console.log('VehicleDetailsComponent: Fetching maintenance history...');
      this.maintenanceHistory = await this.vehicleContractService.getMaintenanceHistory(regNo);
      console.log('VehicleDetailsComponent: Maintenance history received:', this.maintenanceHistory);

      console.log('VehicleDetailsComponent: Fetching insurance history...');
      this.insuranceHistory = await this.vehicleContractService.getInsuranceHistory(regNo);
      console.log('VehicleDetailsComponent: Insurance history received:', this.insuranceHistory);

      console.log('VehicleDetailsComponent: Fetching accident history...');
      this.accidentHistory = await this.vehicleContractService.getAccidentHistory(regNo);
      console.log('VehicleDetailsComponent: Accident history received:', this.accidentHistory);
      
      // Check if current user is owner
      const address = await this.web3Service.userAddress$.toPromise();
      console.log('VehicleDetailsComponent: Current user address:', address);
      if (address && this.vehicleDetails) {
        this.isOwner = address.toLowerCase() === this.vehicleDetails.currentOwner.toLowerCase();
        console.log('VehicleDetailsComponent: Owner status set:', { isOwner: this.isOwner, currentOwner: this.vehicleDetails.currentOwner });
      }
    } catch (error) {
      console.error('VehicleDetailsComponent: Error loading vehicle details:', error);
      this.dialogService.showError('Vehicle Details', 'Failed to load vehicle details');
    } finally {
      this.loadingService.hide();
    }
  }

  async addMaintenance() {
    if (!this.vehicleDetails) {
      console.log('VehicleDetailsComponent: Cannot add maintenance - vehicle details not available');
      return;
    }

    console.log('VehicleDetailsComponent: Adding maintenance with data:', this.newMaintenance);
    try {
      this.isLoading = true;
      await this.vehicleContractService.addMaintenance(
        this.vehicleDetails.regNo,
        new Date(this.newMaintenance.date).getTime() / 1000,
        this.newMaintenance.maintenanceType,
        this.newMaintenance.serviceProvider
      );
      console.log('VehicleDetailsComponent: Maintenance added successfully');
      this.dialogService.showSuccess('Maintenance', 'Maintenance record added successfully');
      this.showAddMaintenance = false;
      this.newMaintenance = { date: 0, maintenanceType: '', serviceProvider: '' };
      await this.loadVehicleDetails(this.vehicleDetails.regNo);
    } catch (error) {
      console.error('VehicleDetailsComponent: Error adding maintenance:', error);
      this.dialogService.showError('Maintenance', 'Failed to add maintenance record');
    } finally {
      this.isLoading = false;
    }
  }

  async addInsurance() {
    if (!this.vehicleDetails) {
      console.log('VehicleDetailsComponent: Cannot add insurance - vehicle details not available');
      return;
    }

    console.log('VehicleDetailsComponent: Adding insurance with data:', this.newInsurance);
    try {
      this.isLoading = true;
      await this.vehicleContractService.addInsurance(
        this.vehicleDetails.regNo,
        this.newInsurance.insuranceRef,
        this.newInsurance.docHash,
        this.newInsurance.docLink
      );
      console.log('VehicleDetailsComponent: Insurance added successfully');
      this.dialogService.showSuccess('Insurance', 'Insurance record added successfully');
      this.showAddInsurance = false;
      this.newInsurance = { insuranceRef: '', docHash: '', docLink: '' };
      await this.loadVehicleDetails(this.vehicleDetails.regNo);
    } catch (error) {
      console.error('VehicleDetailsComponent: Error adding insurance:', error);
      this.dialogService.showError('Insurance', 'Failed to add insurance record');
    } finally {
      this.isLoading = false;
    }
  }

  async addAccident() {
    if (!this.vehicleDetails) {
      console.log('VehicleDetailsComponent: Cannot add accident - vehicle details not available');
      return;
    }

    console.log('VehicleDetailsComponent: Adding accident with data:', this.newAccident);
    try {
      this.isLoading = true;
      await this.vehicleContractService.addAccident(
        this.vehicleDetails.regNo,
        new Date(this.newAccident.date).getTime() / 1000,
        this.newAccident.reportDocHash,
        this.newAccident.reportDocLink
      );
      console.log('VehicleDetailsComponent: Accident added successfully');
      this.dialogService.showSuccess('Accident', 'Accident record added successfully');
      this.showAddAccident = false;
      this.newAccident = { date: 0, reportDocHash: '', reportDocLink: '' };
      await this.loadVehicleDetails(this.vehicleDetails.regNo);
    } catch (error) {
      console.error('VehicleDetailsComponent: Error adding accident:', error);
      this.dialogService.showError('Accident', 'Failed to add accident record');
    } finally {
      this.isLoading = false;
    }
  }

  async resellVehicle() {
    if (!this.vehicleDetails) {
      console.log('VehicleDetailsComponent: Cannot resell vehicle - vehicle details not available');
      return;
    }

    console.log('VehicleDetailsComponent: Reselling vehicle with data:', { 
      regNo: this.vehicleDetails.regNo,
      newOwnerAddress: this.newOwnerAddress,
      resellAmount: this.resellAmount
    });
    try {
      this.isLoading = true;
      await this.vehicleContractService.resaleVehicle(
        this.vehicleDetails.regNo,
        this.newOwnerAddress,
        this.resellAmount
      );
      console.log('VehicleDetailsComponent: Vehicle resold successfully');
      this.dialogService.showSuccess('Resell', 'Vehicle resold successfully');
      this.newOwnerAddress = '';
      this.resellAmount = 0;
      await this.loadVehicleDetails(this.vehicleDetails.regNo);
    } catch (error) {
      console.error('VehicleDetailsComponent: Error reselling vehicle:', error);
      this.dialogService.showError('Resell', 'Failed to resell vehicle');
    } finally {
      this.isLoading = false;
    }
  }
}
