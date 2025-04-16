export const VEHICLE_REGISTRY_CONTRACT_ADDRESS = '0x00000000000000000000000000000000005954d9';

export const VEHICLE_REGISTRY_ABI = [
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