import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { LoadingService } from './loading.service';
import { DialogService } from './dialog.service';
import { Web3Service } from './web3.service';
import { VEHICLE_LEDGER_ABI, VEHICLE_LEDGER_CONTRACT_ADDRESS } from '../ABIs/VehicleLedger.abi';

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

@Injectable({
  providedIn: 'root'
})
export class VehicleContractService {
  private vehicleContract: ethers.Contract | null = null;

  constructor(
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private dialogService: DialogService
  ) {}

  private async getContract() {
    if (!this.vehicleContract) {
      const provider = await this.web3Service.getProvider();
      if (!provider) throw new Error('Provider not initialized');
      
      this.vehicleContract = new ethers.Contract(
        VEHICLE_LEDGER_CONTRACT_ADDRESS,
        VEHICLE_LEDGER_ABI,
        provider
      );
      
      const signer = await this.web3Service.getSigner();
      if (signer) {
        this.vehicleContract = this.vehicleContract.connect(signer);
      }
    }
    return this.vehicleContract;
  }

  // Register a new vehicle
  async registerVehicle(regNo: string, yearOfManufacturing: number): Promise<void> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const tx = await contract['registerVehicle'](regNo, yearOfManufacturing);
      await tx.wait();
      this.dialogService.showSuccess(
        'Vehicle Registration',
        'Vehicle registered successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Vehicle Registration');
    } finally {
      this.loadingService.hide();
    }
  }

  // Add maintenance record
  async addMaintenance(regNo: string, date: number, maintenanceType: string, serviceProvider: string): Promise<void> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const tx = await contract['addMaintenance'](regNo, date, maintenanceType, serviceProvider);
      await tx.wait();
      this.dialogService.showSuccess(
        'Maintenance',
        'Maintenance record added successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Add Maintenance');
    } finally {
      this.loadingService.hide();
    }
  }

  // Add insurance record
  async addInsurance(regNo: string, insuranceRef: string, docHash: string, docLink: string): Promise<void> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const tx = await contract['addInsurance'](regNo, insuranceRef, docHash, docLink);
      await tx.wait();
      this.dialogService.showSuccess(
        'Insurance',
        'Insurance record added successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Add Insurance');
    } finally {
      this.loadingService.hide();
    }
  }

  // Add accident record
  async addAccident(regNo: string, date: number, reportDocHash: string, reportDocLink: string): Promise<void> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const tx = await contract['addAccident'](regNo, date, reportDocHash, reportDocLink);
      await tx.wait();
      this.dialogService.showSuccess(
        'Accident',
        'Accident record added successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Add Accident');
    } finally {
      this.loadingService.hide();
    }
  }

  // Resale vehicle
  async resaleVehicle(regNo: string, newOwner: string, resellAmount: number): Promise<void> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const tx = await contract['resaleVehicle'](regNo, newOwner, resellAmount);
      await tx.wait();
      this.dialogService.showSuccess(
        'Vehicle Resale',
        'Vehicle resold successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Vehicle Resale');
    } finally {
      this.loadingService.hide();
    }
  }

  // Get vehicle details
  async getVehicleDetails(regNo: string): Promise<VehicleDetails | null> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      const [
        regNo_,
        currentOwner,
        pastOwners,
        yearOfManufacturing,
        maintenanceCount,
        insuranceCount,
        accidentCount,
        resellCount
      ] = await contract['getVehicleDetails'](regNo);
      
      return {
        regNo: regNo_,
        currentOwner,
        pastOwners,
        yearOfManufacturing,
        maintenanceCount,
        insuranceCount,
        accidentCount,
        resellCount
      };
    } catch (error) {
      this.handleError(error, 'Get Vehicle Details');
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  // Get maintenance history
  async getMaintenanceHistory(regNo: string): Promise<Maintenance[]> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getMaintenanceHistory'](regNo);
    } catch (error) {
      this.handleError(error, 'Get Maintenance History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  // Get insurance history
  async getInsuranceHistory(regNo: string): Promise<Insurance[]> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getInsuranceHistory'](regNo);
    } catch (error) {
      this.handleError(error, 'Get Insurance History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  // Get accident history
  async getAccidentHistory(regNo: string): Promise<Accident[]> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getAccidentHistory'](regNo);
    } catch (error) {
      this.handleError(error, 'Get Accident History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  // Get resell history
  async getResellHistory(regNo: string): Promise<number[]> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getResellHistory'](regNo);
    } catch (error) {
      this.handleError(error, 'Get Resell History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  // Get past owner history
  async getPastOwnerHistory(regNo: string): Promise<string[]> {
    try {
      this.loadingService.show();
      const contract = await this.getContract();
      return await contract['getPastOwnerHistory'](regNo);
    } catch (error) {
      this.handleError(error, 'Get Past Owner History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  private handleError(error: any, operation: string) {
    console.error(`${operation} error:`, error);
    this.dialogService.showError(
      operation,
      error.message || 'An error occurred'
    );
  }
}
