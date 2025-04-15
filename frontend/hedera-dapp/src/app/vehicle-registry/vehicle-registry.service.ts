import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Web3Service } from '../services/web3.service';
import { VEHICLE_REGISTRY_ABI, VEHICLE_REGISTRY_CONTRACT_ADDRESS } from '../ABIs/vehicle-registry.abi';

@Injectable({ providedIn: 'root' })
export class VehicleRegistryService {
  constructor(private web3Service: Web3Service) {}

  async connectContract() {
    const signer = await this.web3Service.getSigner();
    return new ethers.Contract(VEHICLE_REGISTRY_CONTRACT_ADDRESS, VEHICLE_REGISTRY_ABI, signer);
  }

  async registerVehicle(vehicleId: string) {
    const contract = await this.connectContract();
    const tx = await contract['registerVehicle'](vehicleId);
    return tx.wait();
  }

  async resellVehicle(vehicleId: string, newOwner: string) {
    const contract = await this.connectContract();
    const tx = await contract['resellVehicle'](vehicleId, newOwner);
    return tx.wait();
  }

  async getOwner(vehicleId: string): Promise<string> {
    const contract = await this.connectContract();
    return await contract['getOwner'](vehicleId);
  }
}
