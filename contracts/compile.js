const fs = require("fs");
const solc = require("solc");

// Read Solidity file
const source = fs.readFileSync("VehicleRegistry.sol", "utf8");

// Prepare input for compiler
const input = {
  language: "Solidity",
  sources: {
    "VehicleRegistry.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

// Compile
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Get bytecode
const bytecode = output.contracts["VehicleRegistry.sol"]["sample.sol"].evm.bytecode.object;
fs.writeFileSync("bytecode.txt", bytecode);
console.log("✅ Compiled! Bytecode saved to bytecode.txt");
