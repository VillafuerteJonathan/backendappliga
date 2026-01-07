// src/modules/blockchain/blockchain.service.js

/**
 * Función simulada para enviar hash a la blockchain
 * En producción, aquí iría la integración con Ethereum, Polygon, Hyperledger, etc.
 * @param {string} hash - Hash del acta
 * @param {string} vocalId - ID del vocal que reporta
 */
export async function registrarEnBlockchain(hash, vocalId) {
  try {
    // Simulación de registro en blockchain
    console.log(`[BLOCKCHAIN] Registrando hash: ${hash} por vocal: ${vocalId}`);

    // Aquí podrías:
    // 1️⃣ Crear transacción en smart contract
    // 2️⃣ Guardar txHash en DB
    // 3️⃣ Esperar confirmación

    return true; // simulación exitosa
  } catch (error) {
    console.error("Error registrando en blockchain:", error);
    throw new Error("No se pudo registrar en blockchain");
  }
}
