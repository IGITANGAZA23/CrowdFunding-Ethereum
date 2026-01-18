const { ethers } = require('ethers');
const compiledFactory = require('./build/CampaignFactory.json');

require('dotenv').config();

const deploy = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.link);

    // Create a wallet usage the mnemonic and connect to the provider
    const wallet = ethers.Wallet.fromPhrase(process.env.mnemonic).connect(provider);

    console.log('Attempting to deploy from account', wallet.address);

    const factory = new ethers.ContractFactory(
        JSON.parse(compiledFactory.interface),
        compiledFactory.bytecode,
        wallet
    );

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    console.log('Contract deployed to', await contract.getAddress());

    // Prevent the process from hanging
    process.exit(0);
};

deploy().catch(err => {
    console.error(err);
    process.exit(1);
});