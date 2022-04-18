// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as dotenv from "dotenv";
import fs from "fs";
import hardhat, { ethers } from "hardhat";
dotenv.config();

async function main() {
  // Network
  const networkName = hardhat.network.name as "rinkeby" | "bscTestnet" | "bsc";

  const scanURI = {
    mainnet: "https://etherscan.io",
    rinkeby: "https://rinkeby.etherscan.io",
    bscTestnet: "https://testnet.bscscan.com",
    bsc: "https://bscscan.com",
  };

  // P4CToken deploy
  const P4CToken = await ethers.getContractFactory("P4CToken");
  const p4cToken = await P4CToken.deploy();
  await p4cToken.deployed();

  // ERC721P4 deploy
  const erc721P4Args = [p4cToken.address, "http://localhost:3000"];
  const ERC721P4 = await ethers.getContractFactory("ERC721P4");
  const erc721P4 = await ERC721P4.deploy(...erc721P4Args);
  await erc721P4.deployed();

  const contractsParams = [
    {
      name: "P4CToken",
      contract: p4cToken,
      arguments: [],
    },
    {
      name: "ERC721P4",
      contract: erc721P4,
      arguments: erc721P4Args,
    },
  ];

  await fs.appendFileSync(
    `./deployed.log`,
    `\n## ${networkName} (${new Date()})\n`
  );

  for (let i = 0; i < contractsParams.length; i++) {
    const params = contractsParams[i];
    console.log(
      `${params.name} deployed to: ${scanURI[networkName]}/address/${params.contract.address}#code`
    );
    // Write the arguments
    await fs.writeFile(
      `./arguments/argument-${params.name}-${networkName}.ts`,
      `export default ${JSON.stringify(params.arguments)}`,
      (error) => {
        if (error) console.log(error);
      }
    );

    await fs.appendFileSync(
      `./deployed.log`,
      `${params.name}: ${scanURI[networkName]}/address/${params.contract.address}#code\n` +
        `npx hardhat verify --network ${networkName} ${params.contract.address} --constructor-args ./arguments/argument-${params.name}-${networkName}.ts\n`
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
