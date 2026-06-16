import { Router } from "express";
import {
  getAllAdoptions,
  getAdoptionById,
  createAdoption,
} from "../services/adoptions.service.js";

const router = Router();

// GET /api/adoptions - Obtiene todas las adopciones
router.get("/", async (req, res) => {
  try {
    const adoptions = await getAllAdoptions();
    res.status(200).json({ status: "success", payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/adoptions/:aid - Obtiene una adopción por ID
router.get("/:aid", async (req, res) => {
  try {
    const { aid } = req.params;
    const adoption = await getAdoptionById(aid);
    if (!adoption) {
      return res.status(404).json({ status: "error", message: "Adopción no encontrada" });
    }
    res.status(200).json({ status: "success", payload: adoption });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/adoptions/:uid/:pid - Crea una adopción
router.post("/:uid/:pid", async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const adoption = await createAdoption(uid, pid);
    res.status(201).json({ status: "success", payload: adoption });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ status: "error", message: error.message });
  }
});

export default router;
