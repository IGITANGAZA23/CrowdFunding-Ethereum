const { ethers } = require('ethers');
const compiledFactory = require('./build/CampaignFactory.json');

require('dotenv').config();

const deploy = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.link);

    // Create a wallet usage the mnemonic and connect to the provider
    const wallet = ethers.Wallet.fromMnemonic(process.env.mnemonic).connect(provider);

    console.log('Attempting to deploy from account', wallet.address);

    const factory = new ethers.ContractFactory(
        JSON.parse(compiledFactory.interface),
        compiledFactory.bytecode,
        wallet
    );

    const contract = await factory.deploy();
    await contract.deployed();

    console.log('Contract deployed to', contract.address);

    // Prevent the process from hanging
    process.exit(0);
};

deploy().catch(err => {
    console.error(err);
    process.exit(1);
});