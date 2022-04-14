# The Letscollect Project

## 1. Installation and Deployment
```shell
yarn add
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat run scripts/deploy.ts
```

## 2. Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Rinkeby.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Rinkeby node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
npx hardhat run scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify DEPLOYED_CONTRACT_ADDRESS --constructor-args arguments.ts
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

# Deployment
## Contract Address
Rinkeby: https://rinkeby.etherscan.io/address/0xDb0917b6E0a7fBbdba0a44dB68587Ac1153b2411  
Mainnet: https://etherscan.io/address/0x4073d289078cF607A2FF9473B73eEEA8bC536DfB

## Website
https://letscollect.live/
