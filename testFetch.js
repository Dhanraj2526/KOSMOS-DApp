const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function testFetch() {
  const filePath = path.join(__dirname, "client/src/contractAddress.json");
  const contractConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  const Upload = await ethers.getContractFactory("Upload");
  const contract = Upload.attach(contractConfig.address);
  
  const [owner] = await ethers.getSigners();
  
  try {
    const data = await contract.display(owner.address);
    console.log("Data fetched:", data);
  } catch(e) {
    console.error("Error fetching data:", e.message);
  }
}

testFetch().catch(console.error);
