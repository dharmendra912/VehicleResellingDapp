const {
    AccountId,
    PrivateKey,
    Client,
    ContractCreateFlow,
  } = require("@hashgraph/sdk");
  const fs = require("fs");
  require('dotenv').config();
  
  async function main() {
    const MY_ACCOUNT_ID = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY);
  
    const client = Client.forTestnet();
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
  
    const bytecode = fs.readFileSync("bytecode.txt", "utf8");
  
    const contractCreate = new ContractCreateFlow()
      .setGas(100000)
      .setBytecode(bytecode);
  
    const txResponse = await contractCreate.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newContractId = receipt.contractId;
  
    console.log("✅ Contract deployed!");
    console.log("Contract ID:", newContractId.toString());
    console.log("Explorer:", `https://hashscan.io/testnet/contract/${newContractId}`);
  }
  
  main().catch(console.error);
  