import { Router } from 'express';
import RegistroController from './registro.controller.js';

const router = Router();

// ===============================
// DETALLE DEL PARTIDO
// ===============================
router.get(
  '/partidos/:id/detalle',
  RegistroController.obtenerDetallePartido
);

// ===============================
// INICIAR PARTIDO
// ===============================
router.put(
  '/partidos/:id/iniciar',
  RegistroController.iniciarPartido
);

// ===============================
// ACTUALIZAR MARCADOR (EN JUEGO)
// ===============================
router.put(
  '/partidos/:id/marcador',
  RegistroController.actualizarMarcador
);

// ===============================
// FINALIZAR PARTIDO
// ===============================
router.post(
  '/partidos/:id/finalizar',
  RegistroController.finalizarPartido
);
// Actualizar fecha/hora del encuentro
router.put('/partidos/:id/actualizar-encuentro', RegistroController.actualizarEncuentro);

export default router;
