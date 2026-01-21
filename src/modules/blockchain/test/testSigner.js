import { signer } from "../config/signer.js";

const address = await signer.getAddress();
const balance = await signer.provider.getBalance(address);

console.log("👤 Signer:", address);
console.log("💰 Balance:", balance.toString());
