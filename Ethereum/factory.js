import { Contract } from 'ethers';
import provider from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new Contract(
    '0x6eb1BAb08268e4aBf4585875db85Ce224E68da1f',
    JSON.parse(CampaignFactory.interface),
    provider
);

export default instance;