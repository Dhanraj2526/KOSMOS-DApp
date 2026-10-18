const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function testFetch() {
  const filePath = path.join(__dirname, "client/src/contractAddress.json");
  const contractConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  const Upload = await ethers.getContractFactory("Upload");
  const contract = Upload.attach(contractConfig.address);
  
  const signers = await ethers.getSigners();
  const unauthorizedUser = signers[1];
  
  try {
    const data = await contract.connect(unauthorizedUser).display(signers[0].address);
    console.log("Data fetched:", data);
  } catch(e) {
    console.log("e.message:", e.message);
    if (e.message.includes("You don't have access")) {
      console.log("Matches includes check");
    } else {
      console.log("Does NOT match includes check");
      console.log("Error object keys:", Object.keys(e));
      if (e.reason) console.log("Reason:", e.reason);
      if (e.data && e.data.message) console.log("Data message:", e.data.message);
    }
  }
}

testFetch().catch(console.error);
