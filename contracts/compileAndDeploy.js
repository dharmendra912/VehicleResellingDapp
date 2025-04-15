// Usage: node compileAndDeploy.js <.sol file)

const fs = require("fs");
const solc = require("solc");
const path = require("path");
const {AccountId, PrivateKey, Client, ContractCreateFlow, ContractFunctionParameters} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const contractFile = process.argv[2];
    if (!contractFile) {
        console.error("Please provide the contract filename (e.g., sample.sol)");
        process.exit(1);
    }

    // Extract constructor parameters from command line arguments
    const constructorParams = process.argv.slice(3);  // All parameters after the contract file

    console.log("Contract file name", contractFile);
    console.log("Constructor Parameters:", constructorParams);

    const source = fs.readFileSync(contractFile, "utf8");
    const input = {
        language: "Solidity",
        sources: {[contractFile]: {content: source}},
        settings: {outputSelection: {"*": {"*": ["*"]}}}
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    console.log("output", output);
    const contractName = Object.keys(output.contracts[contractFile])[0];
    const bytecode = output.contracts[contractFile][contractName].evm.bytecode.object;
    const abi = output.contracts[contractFile][contractName].abi;

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0];
    const baseName = contractFile.replace(".sol", "");
    const folderName = `${baseName}_${timestamp}`;

    fs.mkdirSync(folderName);

    fs.writeFileSync(path.join(folderName, contractFile), source);
    fs.writeFileSync(path.join(folderName, `${baseName}.txt`), bytecode);
    fs.writeFileSync(path.join(folderName, `${baseName}.abi.json`), JSON.stringify(abi, null, 2));
    fs.writeFileSync(path.join(folderName, `${baseName}.metadata.json`), JSON.stringify(output, null, 2));

    console.log(`✅ Compilation complete. Files saved to ${folderName}/`);

    const MY_ACCOUNT_ID = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY);
    const client = Client.forTestnet();
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    let contractCreate = new ContractCreateFlow()
        .setGas(5_000_000)
        .setBytecode(bytecode);

    // If there are constructor parameters, add them
    if (constructorParams.length > 0) {
        // Convert the parameters into the correct format using ContractFunctionParameters
        const contractFunctionParams = new ContractFunctionParameters();
        constructorParams.forEach(param => {
            contractFunctionParams.addString(param);  // Assuming parameters are strings, adjust for other types
        });

        console.log("Added ConstructorParameters ", contractFunctionParams)
        contractCreate = contractCreate.setConstructorParameters(contractFunctionParams);
    }

    const txResponse = await contractCreate.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const record = await txResponse.getRecord(client);
    const newContractId = receipt.contractId;
    const evmAddress = newContractId.toSolidityAddress();

    console.log("✅ Contract deployed!");
    console.log("Contract ID:", newContractId.toString());
    console.log("EVM Address:", evmAddress);
    console.log("🔍 HBAR Charged:", parseFloat(record.transactionFee.toString()) / 100_000_000, "HBAR");
    console.log("Explorer:", `https://hashscan.io/testnet/contract/${newContractId}`);

    const entry = `${timestamp}: ${contractFile} - Contract ID: ${newContractId} - EVM Address: (0x${evmAddress})\n`;
    fs.appendFileSync("contracts.txt", entry);
    console.log("✅ Contract details appended to contracts.txt");
}

main().catch(console.error);
