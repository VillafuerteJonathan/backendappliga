import db from '../../../config/db.js';
import crypto from 'crypto';

class PartidoService {
  // Obtener TODOS los campeonatos activos (sin filtro por vocal)
 async obtenerCampeonatosActivosVocal(vocalId) {
  try {
    const query = `
      SELECT DISTINCT
        c.id_campeonato,
        c.nombre,
        c.fecha_inicio,
        c.fecha_fin,
        c.estado,
        (
          SELECT COUNT(*) 
          FROM partidos p2 
          WHERE p2.id_campeonato = c.id_campeonato 
            AND p2.estado = 'pendiente'
        ) as partidos_pendientes
      FROM campeonatos c
      INNER JOIN partidos p ON c.id_campeonato = p.id_campeonato
      WHERE c.estado = true
        AND EXISTS (
          SELECT 1 
          FROM partidos p2 
          WHERE p2.id_campeonato = c.id_campeonato 
            AND p2.estado = 'pendiente'
        )
      ORDER BY c.fecha_inicio DESC, c.nombre ASC
    `;
    const result = await db.query(query);
    return { success: true, data: result.rows, total: result.rowCount };
  } catch (error) {
    throw new Error(`Error al obtener campeonatos activos: ${error.message}`);
  }
}



  // Obtener partidos pendientes por campeonato (sin filtro por vocal)
  async obtenerPartidosPendientes(campeonatoId, filtros = {}) {
    try {
      let query = `
        SELECT
          p.id_partido,
          p.id_campeonato,
          p.goles_local,
          p.goles_visitante,
          p.inasistencia,
          p.estado,
          p.created_at,
          p.id_grupo,
          p.equipo_local,
          p.equipo_visitante,
          el.nombre as equipo_local_nombre,
          el.logo_url as equipo_local_logo,
          ev.nombre as equipo_visitante_nombre,
          ev.logo_url as equipo_visitante_logo,
          g.nombre as grupo_nombre,
          c.nombre as campeonato_nombre,
          c.fecha_inicio,
          c.fecha_fin,
          c.estado as campeonato_estado,
          -- Verificar si este partido ya fue registrado por alguien
          COALESCE(
            (SELECT true FROM actas_blockchain ab WHERE ab.id_partido = p.id_partido LIMIT 1),
            false
          ) as ya_registrado
        FROM partidos p
        INNER JOIN equipos el ON p.equipo_local = el.id_equipo
        INNER JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        INNER JOIN grupo g ON p.id_grupo = g.id_grupo
        INNER JOIN campeonatos c ON p.id_campeonato = c.id_campeonato
        WHERE p.id_campeonato = $1
          AND p.estado = 'pendiente'
          AND c.estado = true
      `;

      const params = [campeonatoId];
      let paramCount = 2;

      if (filtros.equipoId) {
        query += ` AND (p.equipo_local = $${paramCount} OR p.equipo_visitante = $${paramCount})`;
        params.push(filtros.equipoId);
        paramCount++;
      }

      if (filtros.grupoId) {
        query += ` AND p.id_grupo = $${paramCount}`;
        params.push(filtros.grupoId);
        paramCount++;
      }

      if (filtros.soloDisponibles) {
        query += ` AND NOT EXISTS (
          SELECT 1 FROM actas_blockchain ab 
          WHERE ab.id_partido = p.id_partido
        )`;
      }

      query += ` ORDER BY p.created_at DESC`;

      const result = await db.query(query, params);
      return { 
        success: true, 
        data: result.rows, 
        total: result.rowCount 
      };
    } catch (error) {
      throw new Error(`Error al obtener partidos pendientes: ${error.message}`);
    }
  }

  // ============= NUEVO MÉTODO IMPORTANTE =============
  // Verificar si un partido ya fue registrado
  async verificarPartidoYaRegistrado(idPartido) {
    try {
      const query = `
        SELECT 
          ab.id_acta,
          ab.created_at as fecha_registro,
          u.nombre as vocal_nombre,
          u.correo as vocal_correo
        FROM actas_blockchain ab
        INNER JOIN usuarios u ON ab.vocal_id = u.id_usuario
        WHERE ab.id_partido = $1
        LIMIT 1
      `;
      
      const result = await db.query(query, [idPartido]);
      
      return {
        success: true,
        data: result.rows.length > 0 ? result.rows[0] : null,
        ya_registrado: result.rows.length > 0
      };
    } catch (error) {
      throw new Error(`Error al verificar partido: ${error.message}`);
    }
  }
  // =================================================

  // ... [Los otros métodos permanecen igual, solo modifica obtenerHistorialVocal] ...

  // Obtener historial de partidos por vocal (CORREGIDO)
  async obtenerHistorialVocal(vocalId, filtros = {}) {
    try {
      let query = `
        SELECT
          p.id_partido,
          p.goles_local,
          p.goles_visitante,
          p.inasistencia,
          p.estado,
          p.created_at,
          el.nombre as equipo_local_nombre,
          ev.nombre as equipo_visitante_nombre,
          c.nombre as campeonato_nombre,
          ab.hash_acta,
          ab.created_at as fecha_registro
        FROM actas_blockchain ab
        INNER JOIN partidos p ON ab.id_partido = p.id_partido
        INNER JOIN equipos el ON p.equipo_local = el.id_equipo
        INNER JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        INNER JOIN campeonatos c ON p.id_campeonato = c.id_campeonato
        WHERE ab.vocal_id = $1  -- Solo los partidos que ESTE vocal registró
      `;

      const params = [vocalId];
      let paramCount = 2;

      if (filtros.campeonatoId) { 
        query += ` AND p.id_campeonato = $${paramCount}`; 
        params.push(filtros.campeonatoId); 
        paramCount++; 
      }
      
      if (filtros.fechaDesde) { 
        query += ` AND ab.created_at >= $${paramCount}`; 
        params.push(filtros.fechaDesde); 
        paramCount++; 
      }
      
      if (filtros.fechaHasta) { 
        query += ` AND ab.created_at <= $${paramCount}`; 
        params.push(filtros.fechaHasta); 
        paramCount++; 
      }
      
      if (filtros.estado) { 
        query += ` AND p.estado = $${paramCount}`; 
        params.push(filtros.estado); 
        paramCount++; 
      }

      query += ` ORDER BY ab.created_at DESC`;

      const result = await db.query(query, params);
      return { 
        success: true, 
        data: result.rows, 
        total: result.rowCount 
      };
    } catch (error) {
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }
}

export default new PartidoService();