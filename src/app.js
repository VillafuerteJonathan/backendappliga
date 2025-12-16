import express from "express";
import canchaRoutes from "./modules/gestion/canchas/cancha.routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/canchas", canchaRoutes);

app.listen(3001, () => console.log("Servidor corriendo en puerto 3001"));
