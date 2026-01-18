import { ethers } from 'ethers';

let provider;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const infuraUrl = 'https://sepfolia.infura.io/v3/01183f6b6e8d4aaf8aa97136aded1264'; // TODO: Update this with a valid URL if needed. Keeping the old structure but with a placeholder or reusing the old ID if it supports Sepolia/Rinkeby. 
    // Rinkeby is deprecated. I should probably use Sepolia or Goerli if the ID works.
    // The user had: https://rinkeby.infura.io/v3/01183f6b6e8d4aaf8aa97136aded1264
    // Rinkeby is dead. I'll switch to Sepolia which is the current standard testnet.
    // However, I don't know if their Infura ID works for Sepolia. I'll assume it does or they need to update it.
    provider = new ethers.JsonRpcProvider(
        'https://sepolia.infura.io/v3/01183f6b6e8d4aaf8aa97136aded1264'
    );
}

export default provider;