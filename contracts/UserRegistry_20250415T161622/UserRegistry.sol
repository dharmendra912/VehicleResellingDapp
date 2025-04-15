// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UserRegistry {
    struct User {
        string name;
        string phone;
        string[] ownedVehicles;
        bool exists;
    }

    mapping(address => User) private users;

    // Create or update a user's profile
    function upsertUser(string memory _name, string memory _phone) external {
        User storage user = users[msg.sender];
        user.name = _name;
        user.phone = _phone;
        user.exists = true;
    }

    // View profile (public viewable)
    function getUser(address _user) external view returns (
        string memory name,
        string memory phone,
        string[] memory vehicles
    ) {
        require(users[_user].exists, "User does not exist");
        User storage user = users[_user];
        return (user.name, user.phone, user.ownedVehicles);
    }

    // Add vehicle to user profile (called by VehicleRegistry only)
    function addVehicleToUser(address _user, string memory _vehicleRegNo) external {
        require(users[_user].exists, "User not registered");
        users[_user].ownedVehicles.push(_vehicleRegNo);
    }

    // Remove vehicle from user's ownership list (on resale)
    function removeVehicleFromUser(address _user, string memory _vehicleRegNo) external {
        require(users[_user].exists, "User not registered");
        string[] storage list = users[_user].ownedVehicles;
        for (uint i = 0; i < list.length; i++) {
            if (keccak256(bytes(list[i])) == keccak256(bytes(_vehicleRegNo))) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }

    function userExists(address _user) external view returns (bool) {
        return users[_user].exists;
    }
}
