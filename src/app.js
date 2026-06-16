import express from "express";
import mongoose from "mongoose";
import adoptionRouter from "./routes/adoption.router.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/adoptions";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/adoptions", adoptionRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Adoption API running" });
});

// Solo conecta a mongo si no estamos en test
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB conectado");
      app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
    })
    .catch((err) => console.error("Error conectando a MongoDB:", err));
}

export default app;
