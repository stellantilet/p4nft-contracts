import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

describe("P4", () => {
  let accounts: SignerWithAddress[];
  let ERC20P4C: ContractFactory;
  let erc20P4C: Contract;
  let ERC721P4: ContractFactory;
  let erc721P4: Contract;

  it("deploy", async () => {
    accounts = await ethers.getSigners();

    ERC20P4C = await ethers.getContractFactory("P4CToken");
    erc20P4C = await ERC20P4C.deploy();
    await erc20P4C.deployed();

    ERC721P4 = await ethers.getContractFactory("ERC721P4");
    erc721P4 = await ERC721P4.deploy(
      erc20P4C.address,
      "https://localhost:3000/"
    );
    await erc721P4.deployed();
  });

  it("mint NFT", async () => {
    const [owner, addr1, addr2] = accounts;
    let tx: ContractTransaction = await erc721P4.connect(owner).mint();
    expect((await erc721P4.balanceOf(owner.address)).toString()).to.equal("1");
    expect((await erc721P4.tokenURI(0)).toString()).to.equal(
      "https://localhost:3000/0.json"
    );

    await erc721P4.connect(owner).mint();
    await erc721P4.connect(addr1).mint();
    await erc721P4.connect(addr2).mint();
  });

  it("mint TOKEN", async () => {
    const [owner, addr1, addr2] = accounts;
    await erc20P4C.connect(owner).transfer(addr1.address, 100000);
    await erc20P4C.connect(owner).transfer(addr2.address, 100000);

    expect((await erc20P4C.balanceOf(addr1.address)).toString()).to.equal(
      "100000"
    );
    expect((await erc20P4C.balanceOf(addr2.address)).toString()).to.equal(
      "100000"
    );
  });

  it("add rarity", async () => {
    const [owner, addr1, addr2] = accounts;
    await erc20P4C.connect(owner).approve(erc721P4.address, 100);
    await erc721P4.connect(owner).addRarity(0, 100);

    await erc20P4C.connect(addr1).approve(erc721P4.address, 1000);
    await erc721P4.connect(addr1).addRarity(2, 1000);

    await erc20P4C.connect(addr2).approve(erc721P4.address, 2000);
    await erc721P4.connect(addr2).addRarity(3, 2000);

    expect((await erc721P4.rarity(0)).toString()).to.equal("100");
    expect((await erc721P4.rarity(2)).toString()).to.equal("1000");
    expect((await erc721P4.rarity(3)).toString()).to.equal("2000");
  });
});
