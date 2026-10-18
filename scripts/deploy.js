const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const filePath = path.join(__dirname, "../client/src/contractAddress.json");
  const force = process.env.FORCE === "true" || process.argv.includes("--force");

  // 1. Check if contract is already deployed and active on this network
  if (!force && fs.existsSync(filePath)) {
    try {
      const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (config.address && hre.ethers.utils.isAddress(config.address)) {
        const code = await hre.ethers.provider.getCode(config.address);
        if (code && code !== "0x") {
          console.log("✅ Contract is already deployed and active at:", config.address);
          console.log("ℹ️ Reusing existing address — contractAddress.json was NOT changed.");
          console.log("ℹ️ (Pass --force or delete contractAddress.json if you want to deploy a brand new contract).");
          return;
        }
      }
    } catch (err) {
      // If reading fails, proceed with deployment
    }
  }

  // 2. Deploy contract if not already deployed
  const Upload = await hre.ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();

  await upload.deployed();

  console.log("🚀 Contract newly deployed to:", upload.address);

  // 3. Save to contractAddress.json
  const addressConfig = { address: upload.address };
  fs.writeFileSync(filePath, JSON.stringify(addressConfig, null, 2));
  console.log("📄 Updated client/src/contractAddress.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

