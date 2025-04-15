// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// UserContract handles user profiles and vehicle ownership lists.
contract UserContract {
    struct User {
        address userAddress;
        string name;       // optional name
        string phone;      // optional phone
        string[] vehicles; // list of vehicle registration numbers owned
    }

    mapping(address => User) public users;

    // Register or update user profile.
    function registerOrUpdateUser(string calldata _name, string calldata _phone) external {
        User storage user = users[msg.sender];
        user.userAddress = msg.sender;
        user.name = _name;
        user.phone = _phone;
    }

    // Add vehicle registration number to user's list.
    function addVehicleToUser(address _user, string calldata _regNo) external {
        users[_user].vehicles.push(_regNo);
    }

    // Remove vehicle registration number from user's list.
    function removeVehicleFromUser(address _user, string calldata _regNo) external {
        uint len = users[_user].vehicles.length;
        for (uint i = 0; i < len; i++) {
            if (keccak256(bytes(users[_user].vehicles[i])) == keccak256(bytes(_regNo))) {
                // Swap and pop for gas efficiency.
                users[_user].vehicles[i] = users[_user].vehicles[len - 1];
                users[_user].vehicles.pop();
                break;
            }
        }
    }
}

// VehicleContract handles vehicle registration, history and ownership transfer.
contract VehicleContract {
    UserContract public userContract;
    bool public initialized;

    struct Maintenance {
        uint date;
        string maintenanceType;
        string serviceProvider;
    }

    struct Insurance {
        string insuranceRefNo;
        string docHash;
        string docLink;
    }

    struct Accident {
        uint date;
        string reportHash;
        string reportLink;
    }

    struct Vehicle {
        string regNo;           // unique vehicle registration number
        address currentOwner;
        address[] pastOwners;
        uint year;              // year of manufacturing
        Maintenance[] maintenances;
        Insurance[] insurances;
        Accident[] accidents;
    }

    // Internal mapping to store vehicles.
    mapping(string => Vehicle) private vehicles;

    event VehicleRegistered(string regNo, address indexed owner, uint year);
    event OwnershipTransferred(string regNo, address indexed oldOwner, address indexed newOwner);

    // Initialize the contract with UserContract address
    function initialize(address _userContractAddress) external {
        require(!initialized, "Already initialized");
        require(_userContractAddress != address(0), "Invalid user contract address");
        userContract = UserContract(_userContractAddress);
        initialized = true;
    }

    // Register a new vehicle.
    // Caller becomes the current owner.
    function registerVehicle(string calldata _regNo, uint _year) external {
        require(initialized, "Contract not initialized");
        require(vehicles[_regNo].currentOwner == address(0), "Vehicle already registered");

        Vehicle storage v = vehicles[_regNo];
        v.regNo = _regNo;
        v.currentOwner = msg.sender;
        v.year = _year;
        v.pastOwners.push(msg.sender);

        // Update user's profile by adding vehicle registration.
        userContract.addVehicleToUser(msg.sender, _regNo);
        emit VehicleRegistered(_regNo, msg.sender, _year);
    }

    // Getter to return current owner of a vehicle.
    function getCurrentOwner(string calldata _regNo) external view returns (address) {
        return vehicles[_regNo].currentOwner;
    }

    // Only current owner can add a maintenance entry.
    function addMaintenance(
        string calldata _regNo,
        uint _date,
        string calldata _maintenanceType,
        string calldata _serviceProvider
    ) external {
        require(vehicles[_regNo].currentOwner == msg.sender, "Not owner");
        vehicles[_regNo].maintenances.push(Maintenance(_date, _maintenanceType, _serviceProvider));
    }

    // Only current owner can add an insurance entry.
    function addInsurance(
        string calldata _regNo,
        string calldata _insuranceRefNo,
        string calldata _docHash,
        string calldata _docLink
    ) external {
        require(vehicles[_regNo].currentOwner == msg.sender, "Not owner");
        vehicles[_regNo].insurances.push(Insurance(_insuranceRefNo, _docHash, _docLink));
    }

    // Only current owner can add an accident entry.
    function addAccident(
        string calldata _regNo,
        uint _date,
        string calldata _reportHash,
        string calldata _reportLink
    ) external {
        require(vehicles[_regNo].currentOwner == msg.sender, "Not owner");
        vehicles[_regNo].accidents.push(Accident(_date, _reportHash, _reportLink));
    }

    // Transfer vehicle ownership.
    // Caller must be the current owner.
    function transferOwnership(string calldata _regNo, address _newOwner) external {
        require(initialized, "Contract not initialized");
        Vehicle storage v = vehicles[_regNo];
        require(v.currentOwner != address(0), "Vehicle not registered");
        require(v.currentOwner == msg.sender, "Not owner");
        address oldOwner = v.currentOwner;
        v.currentOwner = _newOwner;
        v.pastOwners.push(_newOwner);

        // Update user profiles in UserContract.
        userContract.removeVehicleFromUser(oldOwner, _regNo);
        userContract.addVehicleToUser(_newOwner, _regNo);

        emit OwnershipTransferred(_regNo, oldOwner, _newOwner);
    }
}

// MarketplaceContract calls both UserContract and VehicleContract
// to perform operations like resale, which involve updating both contracts.
contract MarketplaceContract {
    UserContract public userContract;
    VehicleContract public vehicleContract;
    bool public initialized;

    event VehicleResold(string regNo, address indexed oldOwner, address indexed newOwner, uint resaleAmount);

    // Initialize the contract with UserContract and VehicleContract addresses
    function initialize(address _userContract, address _vehicleContract) external {
        require(!initialized, "Already initialized");
        require(_userContract != address(0) && _vehicleContract != address(0), "Invalid contract address");
        userContract = UserContract(_userContract);
        vehicleContract = VehicleContract(_vehicleContract);
        initialized = true;
    }

    // Resell a vehicle.
    // Caller must be the current owner.
    // _resaleAmount is in dollars.
    function resellVehicle(string calldata _regNo, address _newOwner, uint _resaleAmount) external {
        require(initialized, "Contract not initialized");
        address currentOwner = vehicleContract.getCurrentOwner(_regNo);
        require(currentOwner != address(0), "Vehicle not registered");
        require(currentOwner == msg.sender, "Not vehicle owner");

        // Transfer ownership in VehicleContract.
        vehicleContract.transferOwnership(_regNo, _newOwner);
        emit VehicleResold(_regNo, msg.sender, _newOwner, _resaleAmount);
    }
}
