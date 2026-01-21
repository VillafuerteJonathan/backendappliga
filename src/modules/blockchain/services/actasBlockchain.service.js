// src/modules/blockchain/services/actasBlockchain.service.js
import { actasContract } from "../contracts/ActasPartidos.contract.js";

/**
 * Registra un acta en la blockchain.
 * @param {Object} actaData - Datos del acta.
 * @param {string} actaData.idPartido - UUID del partido.
 * @param {string} actaData.hashActa - Hash SHA-256 del acta.
 * @param {string} actaData.arbitroId - UUID del árbitro.
 * @param {string} actaData.vocalId - UUID del vocal.
 * @param {number} actaData.golesLocal - Goles del equipo local.
 * @param {number} actaData.golesVisitante - Goles del equipo visitante.
 * @returns {Promise<Object>} - Retorna el hash de la transacción.
 */
export async function registrarActaBlockchain({
  idPartido,
  hashActa,
  arbitroId,
  vocalId,
  golesLocal,
  golesVisitante
}) {
  try {
    const tx = await actasContract.registrarActa(
      idPartido,
      hashActa,
      arbitroId,
      vocalId,
      golesLocal,
      golesVisitante
    );

    await tx.wait(); // Espera a que la transacción sea confirmada

    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Error registrando acta en blockchain:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtiene un acta de la blockchain por el ID del partido.
 * @param {string} idPartido - UUID del partido.
 * @returns {Promise<Object>} - Retorna los datos del acta.
 */
export async function obtenerActaBlockchain(idPartido) {
  try {
    const acta = await actasContract.obtenerActa(idPartido);

    return {
      success: true,
      data: {
        idPartido: acta[0],
        hashActa: acta[1],
        arbitroId: acta[2],
        vocalId: acta[3],
        golesLocal: acta[4],
        golesVisitante: acta[5],
        timestamp: acta[6]
      }
    };
  } catch (error) {
    console.error("Error obteniendo acta de blockchain:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
