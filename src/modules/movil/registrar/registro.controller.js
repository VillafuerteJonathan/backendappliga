import RegistroService from './registro.service.js';
import { validate as isUUID } from 'uuid';

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
  // FINALIZAR PARTIDO
  // ===============================
  async finalizarPartido(req, res) {
    const { id } = req.params;
    const { golesLocal, golesVisitante, arbitroId, vocalId, hashActa } = req.body;

    if (!isUUID(id)) {
      return res.status(400).json({ message: 'ID de partido inválido' });
    }

    if (!isUUID(vocalId)) {
      return res.status(400).json({ message: 'Vocal inválido' });
    }

    if (
      typeof golesLocal !== 'number' ||
      typeof golesVisitante !== 'number'
    ) {
      return res.status(400).json({ message: 'Marcador inválido' });
    }

    if (!hashActa || typeof hashActa !== 'string') {
      return res.status(400).json({ message: 'Hash de acta requerido' });
    }

    try {
      await RegistroService.finalizarPartido({
        partidoId: id,
        golesLocal,
        golesVisitante,
        arbitroId,
        vocalId,
        hashActa
      });

      return res.status(200).json({
        success: true,
        message: 'Partido finalizado correctamente'
      });
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
}

export default new RegistroController();
