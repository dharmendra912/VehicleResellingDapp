// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./VehicleRegistry.sol";

contract VehicleHistory {
    struct MaintenanceEntry {
        string date;
        string maintenanceType;
        string serviceProvider;
    }

    struct InsuranceEntry {
        string referenceNumber;
        string docHash;
        string docLink;
    }

    struct AccidentEntry {
        string date;
        string reportHash;
        string reportLink;
    }

    struct History {
        MaintenanceEntry[] maintenance;
        InsuranceEntry[] insurance;
        AccidentEntry[] accidents;
    }

    mapping(string => History) private histories;
    VehicleRegistry private vehicleContract;

    constructor(address _vehicleRegistryAddress) {
        vehicleContract = VehicleRegistry(_vehicleRegistryAddress);
    }

    modifier onlyOwner(string memory _regNo) {
        require(vehicleContract.isOwner(_regNo, msg.sender), "Not the vehicle owner");
        _;
    }

    function addMaintenance(string memory _regNo, string memory _date, string memory _type, string memory _provider) external onlyOwner(_regNo) {
        histories[_regNo].maintenance.push(MaintenanceEntry(_date, _type, _provider));
    }

    function addInsurance(string memory _regNo, string memory _ref, string memory _hash, string memory _link) external onlyOwner(_regNo) {
        histories[_regNo].insurance.push(InsuranceEntry(_ref, _hash, _link));
    }

    function addAccident(string memory _regNo, string memory _date, string memory _hash, string memory _link) external onlyOwner(_regNo) {
        histories[_regNo].accidents.push(AccidentEntry(_date, _hash, _link));
    }

    function getFullHistory(string memory _regNo) external view returns (
        MaintenanceEntry[] memory,
        InsuranceEntry[] memory,
        AccidentEntry[] memory
    ) {
        return (
            histories[_regNo].maintenance,
            histories[_regNo].insurance,
            histories[_regNo].accidents
        );
    }
}
