// src/modules/movil/partido.controller.js
import db from '../../../config/db.js';
import partidoService from './partido.service.js';

class PartidoController {
  // Obtener campeonatos activos para vocal
  async obtenerCampeonatosActivos(req, res) {
    try {
      const vocalId = req.user.id;
      const resultado = await partidoService.obtenerCampeonatosActivosVocal(vocalId);
      res.json({ success: true, ...resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Obtener partidos pendientes por campeonato
  async obtenerPartidosPendientes(req, res) {
    try {
      const { campeonatoId } = req.params;
      const filtros = req.query;
      const resultado = await partidoService.obtenerPartidosPendientes(campeonatoId, filtros);
      res.json({ success: true, ...resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Obtener detalles de un partido
  async obtenerPartidoDetalle(req, res) {
    try {
      const { idPartido } = req.params;
      const resultado = await partidoService.obtenerPartidoPorId(idPartido);
      res.json({ success: true, data: resultado.data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // Registrar resultado del partido
  async registrarResultado(req, res) {
    try {
      const { idPartido } = req.params;
      const datos = req.body;
      const vocalId = req.user.id;

      // Validaciones
      if (datos.inasistencia) {
        if (!['local', 'visitante'].includes(datos.inasistencia)) {
          return res.status(400).json({
            success: false,
            message: 'El tipo de inasistencia debe ser "local" o "visitante"'
          });
        }
      } else {
        if (datos.goles_local === undefined || datos.goles_visitante === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Se requieren goles_local y goles_visitante'
          });
        }
        if (datos.goles_local < 0 || datos.goles_visitante < 0) {
          return res.status(400).json({
            success: false,
            message: 'Los goles no pueden ser negativos'
          });
        }
      }

      const resultado = await partidoService.registrarResultadoPartido(idPartido, datos, vocalId);
      res.json(resultado);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Obtener historial de partidos del vocal
  async obtenerHistorial(req, res) {
    try {
      const vocalId = req.user.id;
      const filtros = req.query;
      const resultado = await partidoService.obtenerHistorialVocal(vocalId, filtros);
      res.json({ success: true, ...resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Verificar integridad de acta
  async verificarIntegridad(req, res) {
    try {
      const { idPartido } = req.params;
      const resultado = await partidoService.verificarIntegridadActa(idPartido);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Obtener estadísticas del vocal
  async obtenerEstadisticasVocal(req, res) {
    try {
      const vocalId = req.user.id;
      const query = `
        SELECT 
          COUNT(*) as total_partidos,
          SUM(CASE WHEN p.estado = 'finalizado' THEN 1 ELSE 0 END) as partidos_finalizados,
          SUM(CASE WHEN p.inasistencia IS NOT NULL THEN 1 ELSE 0 END) as partidos_walkover,
          COUNT(DISTINCT p.id_campeonato) as campeonatos_participados,
          MIN(p.created_at) as primer_registro,
          MAX(p.created_at) as ultimo_registro
        FROM partidos p
        INNER JOIN actas_blockchain ab ON p.id_partido = ab.id_partido
        WHERE ab.vocal_id = $1
      `;
      const result = await db.query(query, [vocalId]);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Agregar este método nuevo en el controller

// Verificar si un partido ya fue registrado
async verificarPartidoYaRegistrado(req, res) {
  try {
    const { idPartido } = req.params;
    const resultado = await partidoService.verificarPartidoYaRegistrado(idPartido);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// Y modificar obtenerCampeonatosActivos para quitar vocalId
async obtenerCampeonatosActivos(req, res) {
  try {
    const resultado = await partidoService.obtenerCampeonatosActivosVocal();
    res.json({ 
      success: true, 
      ...resultado 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}
}

export default new PartidoController();
