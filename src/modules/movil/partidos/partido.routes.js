import express from 'express';
import partidoController from './partido.controller.js';
import { auth, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas específicas para vocales
router.use(authorizeRoles('vocal'));

// Obtener campeonatos activos para el vocal
router.get('/campeonatos-activos', partidoController.obtenerCampeonatosActivos);

// Obtener partidos pendientes por campeonato
router.get('/campeonatos/:campeonatoId/partidos-pendientes', partidoController.obtenerPartidosPendientes);

// Obtener detalle de un partido
router.get('/partidos/:idPartido', partidoController.obtenerPartidoDetalle);

// Registrar resultado del partido
router.post('/partidos/:idPartido/registrar-resultado', partidoController.registrarResultado);

// Obtener historial del vocal
router.get('/historial', partidoController.obtenerHistorial);

// Verificar integridad de acta
router.get('/partidos/:idPartido/verificar-integridad', partidoController.verificarIntegridad);

// Obtener estadísticas del vocal
router.get('/estadisticas', partidoController.obtenerEstadisticasVocal);
// Agregar esta nueva ruta
router.get('/partidos/:idPartido/verificar-registro', partidoController.verificarPartidoYaRegistrado);

export default router;
