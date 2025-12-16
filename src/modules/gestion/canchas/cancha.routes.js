import express from 'express';
import {
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
} from './cancha.controller.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Health check
router.get('/health', healthCheckController);

// Obtener estadísticas (público)
router.get('/estadisticas', obtenerEstadisticasController);

// ============================================
// RUTAS BÁSICAS DE CRUD
// ============================================

// Crear cancha
router.post('/', crearCanchaController);

// Listar canchas (solo no eliminadas)
router.get('/', listarCanchasController);

// Obtener cancha por ID
router.get('/:id', obtenerCanchaController);

// Editar cancha
router.put('/:id', editarCanchaController);

// ============================================
// RUTAS PARA GESTIÓN DE ESTADO
// ============================================

// Habilitar cancha
router.patch('/:id/habilitar', habilitarCanchaController);

// Deshabilitar cancha
router.patch('/:id/deshabilitar', deshabilitarCanchaController);

// Cambiar estado (alternativa)
router.patch('/:id/estado', cambiarEstadoCanchaController);

// ============================================
// RUTAS PARA SOFT DELETE
// ============================================

// Eliminar cancha (soft delete)
router.delete('/:id', eliminarCanchaController);

// Restaurar cancha eliminada
router.patch('/:id/restaurar', restaurarCanchaController);

// ============================================
// RUTAS DE ADMINISTRACIÓN (PROTEGER CON MIDDLEWARE)
// ============================================

// Listar canchas eliminadas
router.get('/admin/eliminadas', listarCanchasEliminadasController);

// Listar todas las canchas (incluyendo eliminadas)
router.get('/admin/todas', listarTodasCanchasController);

// Búsqueda avanzada con filtros
router.get('/buscar/avanzado', buscarCanchasController);

// Operaciones masivas
router.post('/bulk', bulkOperationsController);

export default router;