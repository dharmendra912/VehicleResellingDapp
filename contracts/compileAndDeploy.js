// Usage: node compileAndDeploy.js <.sol file)

const fs = require("fs");
const solc = require("solc");
const path = require("path");
const { AccountId, PrivateKey, Client, ContractCreateFlow } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const contractFile = process.argv[2];
    if (!contractFile) {
        console.error("Please provide the contract filename (e.g., sample.sol)");
        process.exit(1);
    }

    const source = fs.readFileSync(contractFile, "utf8");
    const input = {
        language: "Solidity",
        sources: { [contractFile]: { content: source } },
        settings: { outputSelection: { "*": { "*": ["*"] } } }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
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

    const contractCreate = new ContractCreateFlow()
        .setGas(100000)
        .setBytecode(bytecode);
    const txResponse = await contractCreate.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newContractId = receipt.contractId;
    const evmAddress = newContractId.toSolidityAddress();

    console.log("✅ Contract deployed!");
    console.log("Contract ID:", newContractId.toString());
    console.log("EVM Address:", evmAddress);
    console.log("Explorer:", `https://hashscan.io/testnet/contract/${newContractId}`);

    const entry = `${timestamp}: ${contractFile} - Contract ID: ${newContractId} - EVM Address: (${evmAddress})\n`;
    fs.appendFileSync("contracts.txt", entry);
    console.log("✅ Contract details appended to contracts.txt");
}

main().catch(console.error);