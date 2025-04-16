import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { LoadingService } from './loading.service';
import { DialogService } from './dialog.service';
import { Web3Service } from './web3.service';
import { VEHICLE_LEDGER_ABI, VEHICLE_LEDGER_CONTRACT_ADDRESS } from '../ABIs/VehicleLedger.abi';

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

  private async ensureVehicleContract() {
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

  async registerVehicle(regNo: string, yearOfManufacturing: number) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
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

  async getVehicleDetails(regNo: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const [
        owner,
        yearOfManufacturing,
      ] = await contract['getVehicleDetails'](regNo);

      return {
        regNo,
        currentOwner: owner,
        pastOwners: [],
        yearOfManufacturing,
        maintenanceCount: 0,
        insuranceCount: 0,
        accidentCount: 0,
        resellCount: 0
      };
    } catch (error) {
      console.error('Get Vehicle Details error:', error);
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  async getMaintenanceHistory(regNo: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const maintenanceHistory = await contract['getMaintenanceHistory'](regNo);
      return maintenanceHistory;
    } catch (error) {
      this.handleError(error, 'Get Maintenance History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async getInsuranceHistory(regNo: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const insuranceHistory = await contract['getInsuranceHistory'](regNo);
      return insuranceHistory;
    } catch (error) {
      this.handleError(error, 'Get Insurance History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async getAccidentHistory(regNo: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const accidentHistory = await contract['getAccidentHistory'](regNo);
      return accidentHistory;
    } catch (error) {
      this.handleError(error, 'Get Accident History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async getResellHistory(regNo: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const resellHistory = await contract['getResellHistory'](regNo);
      return resellHistory;
    } catch (error) {
      this.handleError(error, 'Get Resell History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async getPastOwnerHistory(regNo: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const pastOwners = await contract['getPastOwnerHistory'](regNo);
      return pastOwners;
    } catch (error) {
      this.handleError(error, 'Get Past Owner History');
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async addMaintenance(regNo: string, date: number, maintenanceType: string, serviceProvider: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const tx = await contract['addMaintenance'](regNo, date, maintenanceType, serviceProvider);
      await tx.wait();
      this.dialogService.showSuccess(
        'Maintenance Record',
        'Maintenance record added successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Add Maintenance');
    } finally {
      this.loadingService.hide();
    }
  }

  async addInsurance(regNo: string, insuranceRef: string, docHash: string, docLink: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const tx = await contract['addInsurance'](regNo, insuranceRef, docHash, docLink);
      await tx.wait();
      this.dialogService.showSuccess(
        'Insurance Record',
        'Insurance record added successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Add Insurance');
    } finally {
      this.loadingService.hide();
    }
  }

  async addAccident(regNo: string, date: number, reportDocHash: string, reportDocLink: string) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const tx = await contract['addAccident'](regNo, date, reportDocHash, reportDocLink);
      await tx.wait();
      this.dialogService.showSuccess(
        'Accident Record',
        'Accident record added successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Add Accident');
    } finally {
      this.loadingService.hide();
    }
  }

  async resaleVehicle(regNo: string, newOwner: string, resellAmount: number) {
    try {
      this.loadingService.show();
      const contract = await this.ensureVehicleContract();
      const tx = await contract['resaleVehicle'](regNo, newOwner, resellAmount);
      await tx.wait();
      this.dialogService.showSuccess(
        'Vehicle Resale',
        'Vehicle resale completed successfully!'
      );
    } catch (error) {
      this.handleError(error, 'Vehicle Resale');
    } finally {
      this.loadingService.hide();
    }
  }

  private handleError(error: any, operation: string) {
    if (error.code === 'CALL_EXCEPTION' &&
        (error.reason === 'Vehicle not found' ||
         error.reason === 'User not found' ||
         error.reason === 'Not authorized')) {
      return;
    }

    console.error(`${operation} error:`, error);

    let errorMessage = 'An error occurred';

    if (error.code === 'CALL_EXCEPTION') {
      const revertReason = error.reason || error.errorArgs?.[0] || 'Unknown reason';
      errorMessage = `Contract reverted: ${revertReason}`;
    }
    else if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaction was rejected by user';
    }
    else if (error.code === 'NETWORK_ERROR' || error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection';
    }
    else if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Insufficient funds for transaction';
    }
    else if (error.message) {
      errorMessage = error.message;
    }

    this.dialogService.showError(operation, errorMessage);
  }
}
