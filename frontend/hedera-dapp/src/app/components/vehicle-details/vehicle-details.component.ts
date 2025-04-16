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
  pastOwnersPrices: string[];
  yearOfManufacturing: number;
  maintenanceCount: number;
  insuranceCount: number;
  accidentCount: number;
  resellCount: number;
  resellHistory: number[];
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
    <!-- Main Content -->
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Vehicle Details</h2>
          <div *ngIf="isOwner" class="flex space-x-2">
            <button (click)="showAddMaintenance = true" class="btn btn-primary btn-sm">
              Add Maintenance
            </button>
            <button (click)="showAddInsurance = true" class="btn btn-primary btn-sm">
              Add Insurance
            </button>
            <button (click)="showAddAccident = true" class="btn btn-primary btn-sm">
              Add Accident
            </button>
            <button (click)="showResellForm = true" class="btn btn-primary btn-sm">
              Resell Vehicle
            </button>
          </div>
        </div>

        <!-- Debug Info -->
        <div class="mb-4 p-4 bg-gray-100 rounded">
          <h3 class="text-lg font-semibold mb-2">Debug Info</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>Is Owner: {{ isOwner }}</div>
            <div>Current User Address: {{ currentUserAddress }}</div>
            <div>Vehicle Owner: {{ vehicleDetails?.currentOwner }}</div>
            <div>Direct Comparison: {{ currentUserAddress?.toLowerCase() === vehicleDetails?.currentOwner?.toLowerCase() }}</div>
            <div>User Address Length: {{ currentUserAddress?.length }}</div>
            <div>Owner Address Length: {{ vehicleDetails?.currentOwner?.length }}</div>
            <div>Vehicle Details Available: {{ !!vehicleDetails }}</div>
            <div>Maintenance History Count: {{ maintenanceHistory.length }}</div>
            <div>Insurance History Count: {{ insuranceHistory.length }}</div>
            <div>Accident History Count: {{ accidentHistory.length }}</div>
          </div>
        </div>

        <!-- Basic Vehicle Information -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Basic Information</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Registration Number</label>
              <p class="mt-1">{{ vehicleDetails?.regNo }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Current Owner</label>
              <p class="mt-1">
                <a [routerLink]="['/user/profile']" [queryParams]="{address: vehicleDetails?.currentOwner}"
                   class="text-blue-600 hover:text-blue-800">
                  {{ vehicleDetails?.currentOwner }}
                </a>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Year of Manufacturing</label>
              <p class="mt-1">{{ vehicleDetails?.yearOfManufacturing }}</p>
            </div>
          </div>
        </div>

        <!-- Maintenance History -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-semibold">Maintenance History</h3>
              <span class="text-sm text-gray-500">({{ vehicleDetails?.maintenanceCount || 0 }} records)</span>
            </div>
          </div>
          <div class="space-y-2">
            <div *ngFor="let record of maintenanceHistory" class="border rounded p-2">
              <div class="flex justify-between">
                <span class="font-medium">{{ formatTimestamp(record.date) }}</span>
                <span class="text-sm text-gray-500">{{ record.maintenanceType }}</span>
              </div>
              <p class="text-sm text-gray-600">{{ record.serviceProvider }}</p>
            </div>
          </div>
        </div>

        <!-- Insurance History -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-semibold">Insurance History</h3>
              <span class="text-sm text-gray-500">({{ vehicleDetails?.insuranceCount || 0 }} records)</span>
            </div>
          </div>
          <div class="space-y-2">
            <div *ngFor="let record of insuranceHistory" class="border rounded p-2">
              <div class="flex justify-between">
                <span class="font-medium">{{ record.insuranceRef }}</span>
                <a [href]="record.docLink" target="_blank" class="text-blue-600 hover:text-blue-800">View Document</a>
              </div>
              <p class="text-sm text-gray-600">{{ record.docHash }}</p>
            </div>
          </div>
        </div>

        <!-- Accident History -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-semibold">Accident History</h3>
              <span class="text-sm text-gray-500">({{ vehicleDetails?.accidentCount || 0 }} records)</span>
            </div>
          </div>
          <div class="space-y-2">
            <div *ngFor="let record of accidentHistory" class="border rounded p-2">
              <div class="flex justify-between">
                <span class="font-medium">{{ formatTimestamp(record.date) }}</span>
                <a [href]="record.reportDocLink" target="_blank" class="text-blue-600 hover:text-blue-800">View Report</a>
              </div>
              <p class="text-sm text-gray-600">{{ record.reportDocHash }}</p>
            </div>
          </div>
        </div>

        <!-- Past Owners List -->
        <div *ngIf="vehicleDetails?.pastOwners?.length" class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Past Owners</h3>
          <div class="space-y-2">
            <div *ngFor="let owner of vehicleDetails?.pastOwners || []; let i = index" class="border rounded p-2">
              <a [routerLink]="['/user/profile']" [queryParams]="{address: owner}"
                 class="text-blue-600 hover:text-blue-800">
                {{ owner }}
              </a>
              <div class="text-sm text-gray-600 mt-1">
                Sold for: {{ vehicleDetails?.resellHistory?.[i] || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay Forms -->
    <div class="fixed inset-0 z-50 overflow-hidden" *ngIf="showAddMaintenance || showAddInsurance || showAddAccident || showResellForm">
      <!-- Backdrop with click handler -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="closeAllForms()"></div>

      <!-- Modal Container -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <!-- Add Maintenance Form -->
        <div *ngIf="showAddMaintenance" class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Add Maintenance Record</h3>
            <form (ngSubmit)="addMaintenance()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input type="datetime-local" [(ngModel)]="newMaintenance.date" name="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Maintenance Type</label>
                <input type="text" [(ngModel)]="newMaintenance.maintenanceType" name="maintenanceType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Service Provider</label>
                <input type="text" [(ngModel)]="newMaintenance.serviceProvider" name="serviceProvider" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" (click)="showAddMaintenance = false" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Record</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Add Insurance Form -->
        <div *ngIf="showAddInsurance" class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Add Insurance Record</h3>
            <form (ngSubmit)="addInsurance()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Insurance Reference</label>
                <input type="text" [(ngModel)]="newInsurance.insuranceRef" name="insuranceRef" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Document Hash</label>
                <input type="text" [(ngModel)]="newInsurance.docHash" name="docHash" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Document Link</label>
                <input type="text" [(ngModel)]="newInsurance.docLink" name="docLink" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" (click)="showAddInsurance = false" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Record</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Add Accident Form -->
        <div *ngIf="showAddAccident" class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Add Accident Record</h3>
            <form (ngSubmit)="addAccident()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input type="datetime-local" [(ngModel)]="newAccident.date" name="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Report Document Hash</label>
                <input type="text" [(ngModel)]="newAccident.reportDocHash" name="reportDocHash" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Report Document Link</label>
                <input type="text" [(ngModel)]="newAccident.reportDocLink" name="reportDocLink" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" (click)="showAddAccident = false" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Record</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Resell Vehicle Form -->
        <div *ngIf="showResellForm" class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Resell Vehicle</h3>
            <form (ngSubmit)="resellVehicle()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">New Owner Address</label>
                <input type="text" [(ngModel)]="newOwnerAddress" name="newOwnerAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" [(ngModel)]="resellPrice" name="resellPrice" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" (click)="showResellForm = false" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Resell Vehicle</button>
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
  showResellForm = false;
  newMaintenance = { date: 0, maintenanceType: '', serviceProvider: '' };
  newInsurance = { insuranceRef: '', docHash: '', docLink: '' };
  newAccident = { date: 0, reportDocHash: '', reportDocLink: '' };
  newOwnerAddress = '';
  resellPrice = 0;
  currentUserAddress: string | null = null;
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
      this.currentUserAddress = address;

      if (address && this.vehicleDetails) {
        this.isOwner = address.toLowerCase() === this.vehicleDetails.currentOwner.toLowerCase();
        console.log('VehicleDetailsComponent: Owner status updated:', {
          isOwner: this.isOwner,
          currentOwner: this.vehicleDetails.currentOwner,
          userAddress: address
        });
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

      // Initialize arrays if not present
      if (!this.vehicleDetails.pastOwners) {
        this.vehicleDetails.pastOwners = [];
      }
      if (!this.vehicleDetails.pastOwnersPrices) {
        this.vehicleDetails.pastOwnersPrices = [];
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
      const address = this.currentUserAddress;
      console.log('VehicleDetailsComponent: Current user address:', address);
      if (address && this.vehicleDetails) {
        const isOwner = address.toLowerCase() === this.vehicleDetails.currentOwner.toLowerCase();
        console.log('VehicleDetailsComponent: Owner status check:', {
          isOwner,
          currentOwner: this.vehicleDetails.currentOwner,
          userAddress: address,
          currentOwnerLower: this.vehicleDetails.currentOwner.toLowerCase(),
          userAddressLower: address.toLowerCase()
        });
        this.isOwner = isOwner;
      } else {
        console.log('VehicleDetailsComponent: Owner status not set - missing address or vehicle details');
        this.isOwner = false;
      }
    } catch (error) {
      console.error('VehicleDetailsComponent: Error loading vehicle details:', error);
      this.dialogService.showError('Vehicle Details', 'Failed to load vehicle details');
    } finally {
      this.loadingService.hide();
    }
  }

  formatTimestamp(timestamp: number): string {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toUTCString();
  }

  async addMaintenance() {
    if (!this.vehicleDetails) {
      console.log('VehicleDetailsComponent: Cannot add maintenance - vehicle details not available');
      return;
    }

    console.log('VehicleDetailsComponent: Adding maintenance with data:', this.newMaintenance);
    try {
      this.isLoading = true;
      const timestamp = Math.floor(new Date(this.newMaintenance.date).getTime() / 1000); // Convert to UTC timestamp
      await this.vehicleContractService.addMaintenance(
        this.vehicleDetails.regNo,
        timestamp,
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
      this.showAddMaintenance = false;
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
      this.showAddInsurance = false;
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
      const timestamp = Math.floor(new Date(this.newAccident.date).getTime() / 1000); // Convert to UTC timestamp
      await this.vehicleContractService.addAccident(
        this.vehicleDetails.regNo,
        timestamp,
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
      this.showAddAccident = false;
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
      resellPrice: this.resellPrice
    });
    try {
      this.isLoading = true;
      await this.vehicleContractService.resaleVehicle(
        this.vehicleDetails.regNo,
        this.newOwnerAddress,
        this.resellPrice
      );
      console.log('VehicleDetailsComponent: Vehicle resold successfully');
      this.dialogService.showSuccess('Resell', 'Vehicle resold successfully');
      this.newOwnerAddress = '';
      this.resellPrice = 0;
      await this.loadVehicleDetails(this.vehicleDetails.regNo);
    } catch (error) {
      console.error('VehicleDetailsComponent: Error reselling vehicle:', error);
      this.dialogService.showError('Resell', 'Failed to resell vehicle');
    } finally {
      this.isLoading = false;
      this.showResellForm = false;
    }
  }

  closeAllForms() {
    this.showAddMaintenance = false;
    this.showAddInsurance = false;
    this.showAddAccident = false;
    this.showResellForm = false;
  }
}
