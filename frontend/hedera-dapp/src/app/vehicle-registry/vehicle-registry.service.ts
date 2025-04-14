import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Web3Service } from '../services/web3.service';

@Injectable({ providedIn: 'root' })
export class VehicleRegistryService {
  private contractAddress = '0x00000000000000000000000000000000005954d9'; // Your Hedera contract ID
  private abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "vehicleId",
          "type": "string"
        }
      ],
      "name": "getOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "vehicleId",
          "type": "string"
        }
      ],
      "name": "registerVehicle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "vehicleId",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "resellVehicle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  constructor(private web3Service: Web3Service) {}

  async connectContract() {
    const signer = await this.web3Service.getSigner();
    return new ethers.Contract(this.contractAddress, this.abi, signer);
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
