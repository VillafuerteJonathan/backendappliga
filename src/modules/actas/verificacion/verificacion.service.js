import pool from "../../../config/db.js";

/**
 * 🔍 Campeonatos con actas pendientes
 */
export async function obtenerCampeonatosConActasPendientes() {
  const query = `
    SELECT DISTINCT
      c.id_campeonato,
      c.nombre
    FROM campeonatos c
    JOIN partidos p ON p.id_campeonato = c.id_campeonato
    WHERE p.estado = 'finalizado'
      AND p.estado_acta = 'pendiente'
    ORDER BY c.nombre;
  `;

  const { rows } = await pool.query(query);
  return rows;
}

/**
 * 📋 Partidos pendientes de verificación + actas
 */
export async function obtenerActasPendientesPorCampeonato(idCampeonato) {
  const query = `
    SELECT
      p.id_partido,
      p.fecha_encuentro,
      p.hora_encuentro,
      p.goles_local,
      p.goles_visitante,

      el.nombre AS equipo_local,
      ev.nombre AS equipo_visitante,
      ca.nombre AS cancha,

      json_agg(
        json_build_object(
          'tipo', aa.tipo,
          'ruta', aa.ruta_archivo,
          'hash', aa.hash_archivo
        )
      ) FILTER (WHERE aa.id_archivo IS NOT NULL) AS actas

    FROM partidos p
    JOIN equipos el ON el.id_equipo = p.equipo_local
    JOIN equipos ev ON ev.id_equipo = p.equipo_visitante
    LEFT JOIN canchas ca ON ca.id_cancha = p.cancha_partido
    LEFT JOIN actas_archivos aa ON aa.id_partido = p.id_partido

    WHERE p.id_campeonato = $1
      AND p.estado = 'finalizado'
      AND p.estado_acta = 'pendiente'

    GROUP BY
      p.id_partido,
      el.nombre,
      ev.nombre,
      ca.nombre

    ORDER BY p.fecha_encuentro DESC;
  `;

  const { rows } = await pool.query(query, [idCampeonato]);
  return rows;
}

/**
 * ✅ Aprobar acta (verificación)
 * 👉 Aquí luego conectas blockchain
 */
export async function aprobarActa({ idPartido, juezId }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔍 Validar estado
    const { rows } = await client.query(
      `
      SELECT estado, estado_acta
      FROM partidos
      WHERE id_partido = $1
      FOR UPDATE
      `,
      [idPartido]
    );

    if (!rows.length) {
      throw new Error("Partido no encontrado");
    }

    if (rows[0].estado_acta !== "pendiente") {
      throw new Error("El acta ya fue revisada");
    }

    // 🔐 TODO: validar hash contra blockchain aquí
    // validateBlockchain(idPartido)

    // ✅ Marcar como aceptado
    await client.query(
      `
      UPDATE partidos
      SET estado_acta = 'aceptado',
          juez_verificador = $2,
          fecha_verificacion = NOW()
      WHERE id_partido = $1
      `,
      [idPartido, juezId]
    );

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
