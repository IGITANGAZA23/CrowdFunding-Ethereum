import { Contract } from 'ethers';
import provider from './web3';
import Campaign from './build/Campaign.json';

export default (address) => {
    return new Contract(
        address,
        JSON.parse(Campaign.interface),
        provider
    );
};