import { Router } from 'express';
import RegistroController from './registro.controller.js';
import uploadActas from '../../../middlewares/uploadActas.middleware.js';

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
// SUBIR ACTAS (🔴 ESTA FALTABA)
// ===============================
router.post(
  '/partidos/:id/actas',
  uploadActas.fields([
    { name: 'frente', maxCount: 1 },
    { name: 'dorso', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log('📥 FILES:', req.files);

      return res.json({
        success: true,
        files: req.files
      });
    } catch (error) {
      console.error('❌ ERROR ACTAS:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);






// ===============================
// FINALIZAR PARTIDO (🔴 CAMBIAR A POST)
// ===============================
router.put(
  '/partidos/:id/finalizar',
  RegistroController.finalizarPartido

);
// Actualizar fecha/hora del encuentro
router.put('/partidos/:id/actualizar-encuentro', RegistroController.actualizarEncuentro);

export default router;
