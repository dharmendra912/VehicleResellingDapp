// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract sample {
    mapping(string => address) public vehicleOwner;

    function registerVehicle(string memory vehicleId) public {
        require(vehicleOwner[vehicleId] == address(0), "Already registered");
        vehicleOwner[vehicleId] = msg.sender;
    }

    function resellVehicle(string memory vehicleId, address newOwner) public {
        require(vehicleOwner[vehicleId] == msg.sender, "Not the owner");
        vehicleOwner[vehicleId] = newOwner;
    }

    function getOwner(string memory vehicleId) public view returns (address) {
        return vehicleOwner[vehicleId];
    }
}
