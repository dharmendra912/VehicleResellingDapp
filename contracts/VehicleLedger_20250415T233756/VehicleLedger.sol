// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleLedger {
    struct Maintenance {
        uint date;
        string maintenanceType;
        string serviceProvider;
    }

    struct Insurance {
        string insuranceRef;
        string docHash;
        string docLink;
    }

    struct Accident {
        uint date;
        string reportDocHash;
        string reportDocLink;
    }

    struct Vehicle {
        string regNo;
        address currentOwner;
        address[] pastOwners;
        uint yearOfManufacturing;
        Maintenance[] maintenanceHistory;
        Insurance[] insuranceHistory;
        Accident[] accidentHistory;
        uint[] resellAmounts;
    }

    mapping(string => Vehicle) public vehicles;
    address public userProfileAddress; // Address of the UserProfile contract

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the creator can call this function");
        _;
    }

    // Set the UserProfile contract address via a method.
    function setUserProfileAddress(address _addr) public onlyOwner {
        userProfileAddress = _addr;
    }

    // Register a new vehicle.
    // Registration accepts only the registration number and year. History entries can be appended later.
    function registerVehicle(string calldata regNo, uint yearOfManufacturing) external {
        // Ensure vehicle doesn't already exist.
        require(vehicles[regNo].yearOfManufacturing == 0, "Vehicle already registered");

        Vehicle storage vehicle = vehicles[regNo];
        vehicle.regNo = regNo;
        vehicle.currentOwner = msg.sender;
        vehicle.yearOfManufacturing = yearOfManufacturing;

        // Call UserProfile to add this vehicle to the user's profile.
        if (userProfileAddress != address(0)) {
            (bool success,) = userProfileAddress.call(
                abi.encodeWithSignature("addVehicle(address,string)", msg.sender, regNo)
            );
            require(success, "addVehicle call failed");
        }
    }

    // Append a maintenance entry. Only the current owner can update.
    function addMaintenance(string calldata regNo, uint date, string calldata maintenanceType, string calldata serviceProvider) external {
        Vehicle storage vehicle = vehicles[regNo];
        require(vehicle.currentOwner != address(0), "Vehicle not found");
        require(vehicle.currentOwner == msg.sender, "Caller is not the owner");
        vehicle.maintenanceHistory.push(Maintenance(date, maintenanceType, serviceProvider));
    }

    // Append an insurance entry. Only the current owner can update.
    function addInsurance(string calldata regNo, string calldata insuranceRef, string calldata docHash, string calldata docLink) external {
        Vehicle storage vehicle = vehicles[regNo];
        require(vehicle.currentOwner != address(0), "Vehicle not found");
        require(vehicle.currentOwner == msg.sender, "Caller is not the owner");
        vehicle.insuranceHistory.push(Insurance(insuranceRef, docHash, docLink));
    }

    // Append an accident entry. Only the current owner can update.
    function addAccident(string calldata regNo, uint date, string calldata reportDocHash, string calldata reportDocLink) external {
        Vehicle storage vehicle = vehicles[regNo];
        require(vehicle.currentOwner != address(0), "Vehicle not found");
        require(vehicle.currentOwner == msg.sender, "Caller is not the owner");
        vehicle.accidentHistory.push(Accident(date, reportDocHash, reportDocLink));
    }

    // Resale a vehicle.
    // Only the current owner can sell. Records resale amount history.
    function resaleVehicle(string calldata regNo, address newOwner, uint resellAmount) external {
        Vehicle storage vehicle = vehicles[regNo];
        require(vehicle.currentOwner == msg.sender, "Caller is not the owner");

        // Record current owner in past owners.
        vehicle.pastOwners.push(msg.sender);
        vehicle.currentOwner = newOwner;
        vehicle.resellAmounts.push(resellAmount);

        // Update UserProfile: remove vehicle from seller and add to buyer.
        if (userProfileAddress != address(0)) {
            (bool success,) = userProfileAddress.call(
                abi.encodeWithSignature("removeVehicle(address,string)", msg.sender, regNo)
            );
            require(success, "removeVehicle call failed");

            (bool successAdd,) = userProfileAddress.call(
                abi.encodeWithSignature("addVehicle(address,string)", newOwner, regNo)
            );
            require(successAdd, "addVehicle call failed");
        }
    }

    function getVehicleDetails(string calldata regNo) external view returns (
        string memory,
        address,
        address[] memory,
        uint,
        uint,
        uint,
        uint,
        uint
    ) {
        Vehicle storage vehicle = vehicles[regNo];
        require(vehicle.yearOfManufacturing != 0, "Vehicle not found");
        return (
            vehicle.regNo,
            vehicle.currentOwner,
            vehicle.pastOwners,
            vehicle.yearOfManufacturing,
            vehicle.maintenanceHistory.length,
            vehicle.insuranceHistory.length,
            vehicle.accidentHistory.length,
            vehicle.resellAmounts.length
        );
    }

    function getMaintenanceHistory(string calldata regNo) external view returns (Maintenance[] memory) {
        return vehicles[regNo].maintenanceHistory;
    }

    function getInsuranceHistory(string calldata regNo) external view returns (Insurance[] memory) {
        return vehicles[regNo].insuranceHistory;
    }

    function getAccidentHistory(string calldata regNo) external view returns (Accident[] memory) {
        return vehicles[regNo].accidentHistory;
    }

    function getResellHistory(string calldata regNo) external view returns (uint[] memory) {
        return vehicles[regNo].resellAmounts;
    }

    function getPastOwnerHistory(string calldata regNo) external view returns (address[] memory) {
        return vehicles[regNo].pastOwners;
    }
}
