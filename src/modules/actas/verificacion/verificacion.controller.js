import {
  obtenerCampeonatosConActasPendientes,
  obtenerActasPendientesPorCampeonato,
  aprobarActa
} from "./verificacion.service.js";

import { validate as isUUID } from 'uuid';

/**
 * 🔍 GET /verificacion/campeonatos
 */
export async function getCampeonatos(req, res) {
  try {
    const data = await obtenerCampeonatosConActasPendientes();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * 📋 GET /verificacion/campeonatos/:id/actas
 */
export async function getActasPorCampeonato(req, res) {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res.status(400).json({ message: "ID de campeonato inválido" });
  }

  try {
    const data = await obtenerActasPendientesPorCampeonato(id);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * ✅ POST /verificacion/actas/:id/aprobar
 */
export async function aprobarActaController(req, res) {
  const { id } = req.params;
  const juezId = req.user?.id_usuario; // viene del JWT

  if (!isUUID(id)) {
    return res.status(400).json({ message: "ID de partido inválido" });
  }

  try {
    await aprobarActa({ idPartido: id, juezId });

    return res.json({
      success: true,
      message: "Acta verificada correctamente"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
