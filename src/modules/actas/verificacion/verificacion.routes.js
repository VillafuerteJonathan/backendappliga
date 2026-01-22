import express from "express";
import {
  getCampeonatos,
  getActasPorCampeonato,
  aprobarActaController
} from "./verificacion.controller.js";

import { auth, authorizeRoles } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// 🔍 Solo JUEZ / DELEGADO
router.get(
  "/campeonatos",
  auth,
  authorizeRoles( "delegado"),
  getCampeonatos
);

router.get(
  "/campeonatos/:id/actas",
  auth,
  authorizeRoles("juez", "delegado"),
  getActasPorCampeonato
);

router.post(
  "/actas/:id/aprobar",
  auth,
  authorizeRoles("juez", "delegado"),
  aprobarActaController
);

export default router;
