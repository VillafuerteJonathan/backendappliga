import hre from "hardhat";

async function main() {
  const ActasPartidos = await hre.ethers.getContractFactory("ActasPartidos");
  const contract = await ActasPartidos.deploy();

  await contract.waitForDeployment();

  console.log("✅ ActasPartidos desplegado en:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
