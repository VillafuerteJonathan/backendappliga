import { JsonRpcProvider } from "ethers";
import { NETWORK } from "./network.js";

export const provider = new JsonRpcProvider(NETWORK.rpcUrl);
