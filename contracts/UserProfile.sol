// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    struct User {
        address walletAddress;
        string name;
        string phone;
        string[] vehicles; // vehicle registration numbers owned by user
    }

    mapping(address => User) public users;

    // Internal function to add a user with no details if not present.
    function ensureUserExists(address userAddr) internal {
        if (users[userAddr].walletAddress == address(0)) {
            // Create a new user with default empty details.
            users[userAddr] = User({
                walletAddress: userAddr,
                name: "",
                phone: "",
                vehicles: new string[](0)
            });
        }
    }

    // Create or update user profile.
    // Called by the user themselves.
    function updateUserProfile(string calldata _name, string calldata _phone) external {
        ensureUserExists(msg.sender);
        User storage user = users[msg.sender];
        user.name = _name;
        user.phone = _phone;
    }

    // Append a vehicle registration number to user's profile.
    // Called from from the VehicleLedger contract.
    function addVehicle(address userAddr, string calldata regNo) external {
        ensureUserExists(userAddr);
        users[userAddr].vehicles.push(regNo);
    }

    // Remove a vehicle registration number from user's profile.
    // Called from the VehicleLedger contract.
    function removeVehicle(address userAddr, string calldata regNo) external {
        User storage user = users[userAddr];
        uint len = user.vehicles.length;
        for (uint i = 0; i < len; i++) {
            if (keccak256(bytes(user.vehicles[i])) == keccak256(bytes(regNo))) {
                // Remove element by swapping with last and popping the array.
                user.vehicles[i] = user.vehicles[len - 1];
                user.vehicles.pop();
                break;
            }
        }
    }

    // Retrieve user profile details.
    // Note: This functions is not marked as view, because they may modify state by ensuring the user exists.
    function getUserProfile(address userAddr) external returns (string memory, string memory, string[] memory) {
        ensureUserExists(userAddr);
        User storage user = users[userAddr];
        return (user.name, user.phone, user.vehicles);
    }

    // Getter for the wallet address associated with the user profile.
    // Note: This functions is not marked as view, because they may modify state by ensuring the user exists.
    function getUserWallet(address userAddr) external returns (address) {
        ensureUserExists(userAddr);
        return users[userAddr].walletAddress;
    }

    // Getter for the user's name.
    function getUserName(address userAddr) external view returns (string memory) {
        return users[userAddr].name;
    }

    // Getter for the user's phone number.
    function getUserPhone(address userAddr) external view returns (string memory) {
        return users[userAddr].phone;
    }

    // Getter for the array of vehicle registration numbers.
    function getUserVehicles(address userAddr) external view returns (string[] memory) {
        return users[userAddr].vehicles;
    }
}
