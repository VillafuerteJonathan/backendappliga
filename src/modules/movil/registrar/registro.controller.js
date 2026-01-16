import RegistroService from './registro.service.js';
import { validate as isUUID } from 'uuid';
import path from "path";
import fs from "fs";
import { calcularHash } from "../../blockchain/hash.util.js";




class RegistroController {

  // ===============================
  // DETALLE PARTIDO
  // ===============================
  async obtenerDetallePartido(req, res) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(400).json({ message: 'ID de partido inválido' });
    }

    try {
      const data = await RegistroService.obtenerDetallePartido(id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  // ===============================
  // INICIAR PARTIDO
  // ===============================
async iniciarPartido(req, res) {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res.status(400).json({ message: 'ID de partido inválido' });
  }

  try {
    const data = await RegistroService.iniciarPartido(id);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error.message
    });
  }
}



  // ===============================
  // ACTUALIZAR MARCADOR
  // ===============================
  async actualizarMarcador(req, res) {
    const { id } = req.params;
    const { golesLocal, golesVisitante } = req.body;

    if (!isUUID(id)) {
      return res.status(400).json({ message: 'ID de partido inválido' });
    }

    if (
      typeof golesLocal !== 'number' ||
      typeof golesVisitante !== 'number' ||
      golesLocal < 0 ||
      golesVisitante < 0
    ) {
      return res.status(400).json({ message: 'Marcador inválido' });
    }

    try {
      await RegistroService.actualizarMarcador(id, golesLocal, golesVisitante);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(409).json({ message: error.message });
    }
  }
   // ===============================
  // ACTUALIZAR FECHA/HORA DEL ENCUENTRO
  // ===============================
  async actualizarEncuentro(req, res) {
    const { id } = req.params;
    const { fecha_encuentro, hora_encuentro } = req.body;

    if (!isUUID(id)) {
      return res.status(400).json({ message: 'ID de partido inválido' });
    }

    if (!fecha_encuentro && !hora_encuentro) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos fecha o hora para actualizar'
      });
    }

    try {
      const actualizado = await RegistroService.actualizarEncuentro(
        id,
        fecha_encuentro,
        hora_encuentro
      );

      return res.status(200).json({
        success: true,
        message: 'Encuentro actualizado correctamente',
        data: actualizado
      });

    } catch (error) {
      console.error('❌ Error actualizar encuentro:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }


// ===============================
// FINALIZAR PARTIDO
// ===============================
async finalizarPartido(req, res) {
  const { id } = req.params;
  const { golesLocal, golesVisitante, vocalId, arbitroId } = req.body;

  // 🔎 Validaciones
  if (!isUUID(id)) {
    return res.status(400).json({ message: "ID de partido inválido" });
  }

  if (!isUUID(vocalId)) {
    return res.status(400).json({ message: "Vocal inválido" });
  }
  if (!isUUID(arbitroId)) {
    return res.status(400).json({ message: "Árbitro inválido" });
  }

  if (
    typeof golesLocal !== "number" ||
    typeof golesVisitante !== "number" ||
    golesLocal < 0 ||
    golesVisitante < 0
  ) {
    return res.status(400).json({ message: "Marcador inválido" });
  }

  // 📁 Rutas de actas
  const actaDir = path.join(process.cwd(), "uploads", "actas", id);
  const frentePath = path.join(actaDir, "frente.jpg");
  const dorsoPath = path.join(actaDir, "dorso.jpg");

  if (!fs.existsSync(frentePath) || !fs.existsSync(dorsoPath)) {
    return res.status(400).json({
      message: "No se puede finalizar el partido sin acta frente y dorso"
    });
  }

  try {
    // 🔐 CALCULAR HASH REAL
    const hashActa = await calcularHash(frentePath, dorsoPath);

    console.log("🔐 HASH ACTA:", hashActa);

    await RegistroService.finalizarPartido({
      partidoId: id,
      golesLocal,
      golesVisitante,
      vocalId,
      arbitroId,
      hashActa
    });

    return res.status(200).json({
      success: true,
      message: "Partido finalizado correctamente"
    });

  } catch (error) {
    console.error("❌ Error finalizando partido:", error);
    return res.status(409).json({
      success: false,
      message: error.message
    });
  }
}
// ===============================
// SUBIR ACTAS
// ===============================
async subirActas(req, res) {
  try {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de partido inválido"
      });
    }

    const frente = req.files?.frente?.[0];
    const dorso = req.files?.dorso?.[0];

    if (!frente || !dorso) {
      return res.status(400).json({
        success: false,
        message: "Debe subir acta frente y dorso"
      });
    }

    // ✅ Solo confirmamos subida
    return res.status(200).json({
      success: true,
      message: "Actas subidas correctamente"
    });

  } catch (error) {
    console.error("❌ Error subir actas:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }

}
}

export default new RegistroController();