const assert = require('assert');
const ganache = require('ganache-cli');
const { ethers } = require('ethers');

// Wrap legacy ganache provider to be EIP-1193 compatible
// This is necessary because Ethers v6 expects a provider with a `request` method
const ganacheProvider = ganache.provider();
const eip1193Provider = {
  request: (request) => {
    return new Promise((resolve, reject) => {
      ganacheProvider.sendAsync({
        jsonrpc: '2.0',
        method: request.method,
        params: request.params || [],
        id: Date.now()
      }, (error, response) => {
        if (error) {
          reject(error);
        } else if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  }
};

const provider = new ethers.BrowserProvider(eip1193Provider);

const compileFactory = require('../Ethereum/build/CampaignFactory.json');
const compileCampaign = require('../Ethereum/build/Campaign.json');

let accounts;
let signers;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // Get signers from the provider
  signers = await provider.listAccounts();
  accounts = signers.map(s => s.address);

  // Deploy Factory
  const factoryFactory = new ethers.ContractFactory(
    JSON.parse(compileFactory.interface),
    compileFactory.bytecode,
    signers[0]
  );

  factory = await factoryFactory.deploy();
  await factory.waitForDeployment();

  // Create Campaign
  const tx = await factory.createCampaign('100');
  await tx.wait(); // Wait for transaction to be mined

  [campaignAddress] = await factory.getDeployedCampaigns();

  // Connect to the deployed campaign
  campaign = new ethers.Contract(
    campaignAddress,
    JSON.parse(compileCampaign.interface),
    signers[0]
  );
});

describe('Campaigns', () => {
  it('deploys a factory and Campaigns', async () => {
    assert.ok(await factory.getAddress());
    assert.ok(await campaign.getAddress());
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.manager();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.connect(signers[1]).contribute({
      value: 200
    });

    const isApprover = await campaign.approvers(accounts[1]);
    assert(isApprover);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.contribute({
        value: 50 // less than 100
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.createRequest('Buy solar light', '100', accounts[1]);

    // In Ethers, structs are returned as Result objects (array-like with named properties)
    const request = await campaign.requests(0);
    assert.equal('Buy solar light', request.description);
  });

  it('processes requests', async () => {
    // Contribute
    await campaign.contribute({
      value: ethers.parseEther('10')
    });

    // Create Request: (description, value, recipient)
    await campaign.createRequest(
      'Buy solar light',
      ethers.parseEther('5'),
      accounts[1]
    );

    // Approve Request
    await campaign.approveRequest(0);

    // Finalize Request
    await campaign.finalizeRequest(0);

    // Check Balance
    let balance = await provider.getBalance(accounts[1]);
    balance = parseFloat(ethers.formatEther(balance));

    // account[1] started with ~100 ETH (ganache default)
    // +5 ETH from request
    // So balance should be > 104
    assert(balance > 104);
  });
});
