// src/modules/blockchain/test/testProvider.js
import { provider } from "../config/provider.js";

async function testProvider() {
  const network = await provider.getNetwork();
  const block = await provider.getBlockNumber();

  console.log("🌐 Network:", network.name);
  console.log("📦 Bloque actual:", block);
}

await testProvider();
