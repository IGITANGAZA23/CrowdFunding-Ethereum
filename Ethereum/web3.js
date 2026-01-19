import { ethers } from "ethers";

let provider;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    provider = new ethers.providers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/01183f6b6e8d4aaf8aa97136aded1264"
    );
}

export default provider;