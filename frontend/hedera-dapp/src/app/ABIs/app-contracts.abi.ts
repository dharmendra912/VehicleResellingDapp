export const ADDRESS = '0x0000000000000000000000000000000000597972';

export const VEHICLE_REGISTRY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "regNo",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "resaleAmount",
        "type": "uint256"
      }
    ],
    "name": "VehicleResold",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vehicleContract",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_regNo",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_resaleAmount",
        "type": "uint256"
      }
    ],
    "name": "resellVehicle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "userContract",
    "outputs": [
      {
        "internalType": "contract UserContract",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vehicleContract",
    "outputs": [
      {
        "internalType": "contract VehicleContract",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
