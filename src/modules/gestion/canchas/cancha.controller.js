// cancha.controller.js
import * as canchaService from './cancha.service.js';

// ============================================
// CONTROLADORES PARA CRUD BÁSICO
// ============================================

/**
 * Crear una nueva cancha
 */
export const crearCanchaController = async (req, res) => {
  try {
    const cancha = await canchaService.crearCancha(req.body);
    
    res.status(201).json({
      success: true,
      data: cancha,
      message: 'Cancha creada exitosamente'
    });
  } catch (error) {
    console.error('Error en crearCanchaController:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Listar todas las canchas NO ELIMINADAS (para usuarios normales)
 */
export const listarCanchasController = async (req, res) => {
  try {
    const canchas = await canchaService.listarCanchas();
    
    res.status(200).json({
      success: true,
      data: canchas,
      count: canchas.length,
      message: canchas.length > 0 
        ? 'Canchas obtenidas exitosamente' 
        : 'No hay canchas registradas'
    });
  } catch (error) {
    console.error('Error en listarCanchasController:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener canchas',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Obtener una cancha específica por ID
 */
export const obtenerCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const { incluirEliminadas } = req.query;
    
    const cancha = await canchaService.obtenerCanchaPorId(
      id, 
      incluirEliminadas === 'true'
    );
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: 'Cancha obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error en obtenerCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Cancha no encontrada',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Editar una cancha existente
 */
export const editarCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const cancha = await canchaService.editarCancha(id, req.body);
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: 'Cancha actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en editarCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Error al actualizar cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ============================================
// CONTROLADORES PARA GESTIÓN DE ESTADO
// ============================================

/**
 * Habilitar una cancha
 */
export const habilitarCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const cancha = await canchaService.habilitarCancha(id);
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: 'Cancha habilitada exitosamente'
    });
  } catch (error) {
    console.error('Error en habilitarCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Error al habilitar cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Deshabilitar una cancha
 */
export const deshabilitarCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const cancha = await canchaService.deshabilitarCancha(id);
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: 'Cancha deshabilitada exitosamente'
    });
  } catch (error) {
    console.error('Error en deshabilitarCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Error al deshabilitar cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Cambiar estado de una cancha (alternativa unificada)
 */
export const cambiarEstadoCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (typeof estado !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'El campo "estado" debe ser un valor booleano'
      });
    }
    
    const cancha = await canchaService.cambiarEstadoCancha(id, estado);
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: `Cancha ${estado ? 'habilitada' : 'deshabilitada'} exitosamente`
    });
  } catch (error) {
    console.error('Error en cambiarEstadoCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Error al cambiar estado de la cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ============================================
// CONTROLADORES PARA SOFT DELETE
// ============================================

/**
 * Eliminar una cancha (soft delete)
 */
export const eliminarCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const cancha = await canchaService.eliminarCancha(id);
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: 'Cancha eliminada exitosamente',
      warning: 'Esta es una eliminación lógica. La cancha puede ser restaurada.'
    });
  } catch (error) {
    console.error('Error en eliminarCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Error al eliminar cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Restaurar una cancha eliminada
 */
export const restaurarCanchaController = async (req, res) => {
  try {
    const { id } = req.params;
    const cancha = await canchaService.restaurarCancha(id);
    
    res.status(200).json({
      success: true,
      data: cancha,
      message: 'Cancha restaurada exitosamente'
    });
  } catch (error) {
    console.error('Error en restaurarCanchaController:', error);
    
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Error al restaurar cancha',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Listar canchas eliminadas (para administradores)
 */
export const listarCanchasEliminadasController = async (req, res) => {
  try {
    const canchas = await canchaService.listarCanchasEliminadas();
    
    res.status(200).json({
      success: true,
      data: canchas,
      count: canchas.length,
      message: canchas.length > 0 
        ? 'Canchas eliminadas obtenidas exitosamente' 
        : 'No hay canchas eliminadas'
    });
  } catch (error) {
    console.error('Error en listarCanchasEliminadasController:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener canchas eliminadas',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Listar TODAS las canchas (incluyendo eliminadas - para administradores)
 */
export const listarTodasCanchasController = async (req, res) => {
  try {
    const canchas = await canchaService.listarTodasCanchas();
    
    res.status(200).json({
      success: true,
      data: canchas,
      count: canchas.length,
      message: 'Todas las canchas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error en listarTodasCanchasController:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener todas las canchas',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ============================================
// CONTROLADORES PARA BÚSQUEDA Y FILTROS
// ============================================

/**
 * Buscar canchas por criterios
 */
export const buscarCanchasController = async (req, res) => {
  try {
    const { 
      nombre, 
      tipo_deporte, 
      ubicacion, 
      estado,
      eliminado,
      pagina = 1,
      limite = 10
    } = req.query;
    
    const filtros = {};
    
    if (nombre) filtros.nombre = nombre;
    if (tipo_deporte) filtros.tipo_deporte = tipo_deporte;
    if (ubicacion) filtros.ubicacion = ubicacion;
    if (estado !== undefined) filtros.estado = estado === 'true';
    if (eliminado !== undefined) filtros.eliminado = eliminado === 'true';
    
    const resultado = await canchaService.buscarCanchas(filtros, {
      pagina: parseInt(pagina),
      limite: parseInt(limite)
    });
    
    res.status(200).json({
      success: true,
      data: resultado.canchas,
      paginacion: {
        pagina: resultado.pagina,
        limite: resultado.limite,
        total: resultado.total,
        totalPaginas: resultado.totalPaginas,
        hasNext: resultado.hasNext,
        hasPrev: resultado.hasPrev
      },
      message: 'Búsqueda completada exitosamente'
    });
  } catch (error) {
    console.error('Error en buscarCanchasController:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al buscar canchas',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Obtener estadísticas de canchas
 */
export const obtenerEstadisticasController = async (req, res) => {
  try {
    const estadisticas = await canchaService.obtenerEstadisticas();
    
    res.status(200).json({
      success: true,
      data: estadisticas,
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error en obtenerEstadisticasController:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ============================================
// CONTROLADOR DE SALUD (HEALTH CHECK)
// ============================================

/**
 * Verificar estado del servicio de canchas
 */
export const healthCheckController = async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await canchaService.healthCheck();
    
    res.status(200).json({
      success: true,
      message: 'Servicio de canchas operativo',
      timestamp: new Date().toISOString(),
      service: 'canchas-service',
      status: 'healthy'
    });
  } catch (error) {
    console.error('Error en healthCheckController:', error);
    
    res.status(503).json({
      success: false,
      message: 'Servicio de canchas no disponible',
      timestamp: new Date().toISOString(),
      service: 'canchas-service',
      status: 'unhealthy',
      error: error.message
    });
  }
};

// ============================================
// CONTROLADOR PARA BULK OPERATIONS
// ============================================

/**
 * Operaciones masivas en canchas
 */
export const bulkOperationsController = async (req, res) => {
  try {
    const { operation, ids, data } = req.body;
    
    if (!operation || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere una operación y una lista de IDs válida'
      });
    }
    
    let result;
    
    switch (operation) {
      case 'habilitar':
        result = await canchaService.habilitarMultiplesCanchas(ids);
        break;
      case 'deshabilitar':
        result = await canchaService.deshabilitarMultiplesCanchas(ids);
        break;
      case 'eliminar':
        result = await canchaService.eliminarMultiplesCanchas(ids);
        break;
      case 'restaurar':
        result = await canchaService.restaurarMultiplesCanchas(ids);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Operación no válida. Opciones: habilitar, deshabilitar, eliminar, restaurar'
        });
    }
    
    res.status(200).json({
      success: true,
      data: result,
      message: `Operación "${operation}" completada en ${result.length} canchas`
    });
  } catch (error) {
    console.error('Error en bulkOperationsController:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error en operación masiva',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ============================================
// EXPORTAR TODOS LOS CONTROLADORES
// ============================================

export default {
  // CRUD básico
  crearCanchaController,
  listarCanchasController,
  obtenerCanchaController,
  editarCanchaController,
  
  // Gestión de estado
  habilitarCanchaController,
  deshabilitarCanchaController,
  cambiarEstadoCanchaController,
  
  // Soft delete
  eliminarCanchaController,
  restaurarCanchaController,
  listarCanchasEliminadasController,
  listarTodasCanchasController,
  
  // Búsqueda y filtros
  buscarCanchasController,
  obtenerEstadisticasController,
  
  // Health check
  healthCheckController,
  
  // Bulk operations
  bulkOperationsController
};