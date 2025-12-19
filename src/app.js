import express from "express";
import canchaRoutes from "./modules/gestion/canchas/cancha.routes.js";
import arbitroRoutes from "./modules/gestion/arbitros/arbitros.router.js";
import authRoutes from "./modules/usuarios/auth/auth.routes.js";
import delegadosRouter from './modules/usuarios/delegados/delegados.router.js';
import { UsuarioService } from './modules/usuarios/admin.service.js';

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
// Crear admin al arrancar
UsuarioService.crearAdmin();

// Rutas
app.use('/api/auth', authRoutes);
app.use("/api/canchas", canchaRoutes);
app.use("/api/arbitros", arbitroRoutes);
app.use('/api/delegados', delegadosRouter);

app.listen(3001, () => console.log("Servidor corriendo en puerto 3001"));