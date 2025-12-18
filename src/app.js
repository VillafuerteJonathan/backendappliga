import express from "express";
import canchaRoutes from "./modules/gestion/canchas/cancha.routes.js";
import arbitroRoutes from "./modules/gestion/arbitros/arbitros.router.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/canchas", canchaRoutes);
app.use("/api/arbitros", arbitroRoutes);

app.listen(3001, () => console.log("Servidor corriendo en puerto 3001"));