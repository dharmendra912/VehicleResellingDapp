// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./UserRegistry.sol";

contract VehicleRegistry {
    struct Vehicle {
        string registrationNumber;
        address currentOwner;
        address[] pastOwners;
        uint16 yearOfManufacturing;
        bool exists;
    }

    mapping(string => Vehicle) private vehicles;
    UserRegistry private userContract;

    constructor(address _userRegistryAddress) {
        userContract = UserRegistry(_userRegistryAddress);
    }

    modifier onlyOwner(string memory _regNo) {
        require(vehicles[_regNo].exists, "Vehicle does not exist");
        require(vehicles[_regNo].currentOwner == msg.sender, "Caller is not vehicle owner");
        _;
    }

    function registerVehicle(string memory _regNo, uint16 _year) external {
        require(!vehicles[_regNo].exists, "Vehicle already registered");
        require(userContract.userExists(msg.sender), "User must register first");

        vehicles[_regNo] = Vehicle({
            registrationNumber: _regNo,
            currentOwner: msg.sender,
            pastOwners: new address,
            yearOfManufacturing: _year,
            exists: true
        });

        userContract.addVehicleToUser(msg.sender, _regNo);
    }

    function getVehicle(string memory _regNo) external view returns (
        address currentOwner,
        address[] memory pastOwners,
        uint16 yearOfManufacturing
    ) {
        require(vehicles[_regNo].exists, "Vehicle not found");
        Vehicle storage v = vehicles[_regNo];
        return (v.currentOwner, v.pastOwners, v.yearOfManufacturing);
    }

    function transferVehicle(string memory _regNo, address _newOwner) external onlyOwner(_regNo) {
        require(userContract.userExists(_newOwner), "New owner must be a registered user");

        Vehicle storage v = vehicles[_regNo];
        v.pastOwners.push(msg.sender);
        v.currentOwner = _newOwner;

        userContract.removeVehicleFromUser(msg.sender, _regNo);
        userContract.addVehicleToUser(_newOwner, _regNo);
    }

    function isOwner(string memory _regNo, address _addr) external view returns (bool) {
        return vehicles[_regNo].exists && vehicles[_regNo].currentOwner == _addr;
    }

    function vehicleExists(string memory _regNo) external view returns (bool) {
        return vehicles[_regNo].exists;
    }
}
