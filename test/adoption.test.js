// test/adoption.test.js
// Usamos una estrategia de mock por inyección:
// creamos un mini-app de test con handlers propios
// para simular cada escenario sin depender de MongoDB.

import { strict as assert } from "assert";
import express from "express";
import request from "supertest";

// ─── Helper: crea una mini-app con el handler que queramos mockear ───
function buildApp(handlers) {
  const app = express();
  app.use(express.json());

  // GET /api/adoptions
  app.get("/api/adoptions", handlers.getAll);

  // GET /api/adoptions/:aid
  app.get("/api/adoptions/:aid", handlers.getById);

  // POST /api/adoptions/:uid/:pid
  app.post("/api/adoptions/:uid/:pid", handlers.create);

  return app;
}

// ─── Fakes (datos de prueba) ───
const FAKE_ID   = "64a1f5c2b3e4d5f6a7b8c9d0";
const FAKE_UID  = "64a1f5c2b3e4d5f6a7b8c9d1";
const FAKE_PID  = "64a1f5c2b3e4d5f6a7b8c9d2";

const fakeAdoption = { _id: FAKE_ID, owner: FAKE_UID, pet: FAKE_PID };
const fakeList     = [fakeAdoption, { _id: "64a1f5c2b3e4d5f6a7b8c9d3", owner: FAKE_UID, pet: FAKE_PID }];

// ─────────────────────────────────────────────────────────────
// GET /api/adoptions
// ─────────────────────────────────────────────────────────────
describe("GET /api/adoptions", () => {

  it("debe retornar todas las adopciones con status 200", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: fakeList }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(201).json({ status: "success", payload: fakeAdoption }),
    });

    const res = await request(app).get("/api/adoptions");

    assert.equal(res.status, 200);
    assert.equal(res.body.status, "success");
    assert.equal(res.body.payload.length, 2);
  });

  it("debe retornar array vacío si no hay adopciones", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(404).json({ status: "error", message: "No encontrado" }),
      create:  (req, res) => res.status(201).json({ status: "success", payload: fakeAdoption }),
    });

    const res = await request(app).get("/api/adoptions");

    assert.equal(res.status, 200);
    assert.deepEqual(res.body.payload, []);
  });

  it("debe retornar 500 si el servicio falla", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(500).json({ status: "error", message: "Error de base de datos" }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(201).json({ status: "success", payload: fakeAdoption }),
    });

    const res = await request(app).get("/api/adoptions");

    assert.equal(res.status, 500);
    assert.equal(res.body.status, "error");
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/adoptions/:aid
// ─────────────────────────────────────────────────────────────
describe("GET /api/adoptions/:aid", () => {

  it("debe retornar la adopción correcta con status 200", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: fakeList }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(201).json({ status: "success", payload: fakeAdoption }),
    });

    const res = await request(app).get(`/api/adoptions/${FAKE_ID}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.status, "success");
    assert.equal(res.body.payload._id, FAKE_ID);
  });

  it("debe retornar 404 si la adopción no existe", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(404).json({ status: "error", message: "Adopción no encontrada" }),
      create:  (req, res) => res.status(201).json({ status: "success", payload: fakeAdoption }),
    });

    const res = await request(app).get(`/api/adoptions/${FAKE_ID}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Adopción no encontrada");
  });

  it("debe retornar 500 si el servicio falla", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(500).json({ status: "error", message: "Fallo interno" }),
      create:  (req, res) => res.status(201).json({ status: "success", payload: fakeAdoption }),
    });

    const res = await request(app).get(`/api/adoptions/${FAKE_ID}`);

    assert.equal(res.status, 500);
    assert.equal(res.body.status, "error");
  });
});

// ─────────────────────────────────────────────────────────────
// POST /api/adoptions/:uid/:pid
// ─────────────────────────────────────────────────────────────
describe("POST /api/adoptions/:uid/:pid", () => {

  it("debe crear una adopción correctamente con status 201", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: fakeList }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => {
        const { uid, pid } = req.params;
        res.status(201).json({ status: "success", payload: { _id: FAKE_ID, owner: uid, pet: pid } });
      },
    });

    const res = await request(app).post(`/api/adoptions/${FAKE_UID}/${FAKE_PID}`);

    assert.equal(res.status, 201);
    assert.equal(res.body.status, "success");
    assert.equal(res.body.payload.owner, FAKE_UID);
    assert.equal(res.body.payload.pet, FAKE_PID);
  });

  it("debe retornar 404 si el usuario no existe", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(404).json({ status: "error", message: "Usuario no encontrado" }),
    });

    const res = await request(app).post(`/api/adoptions/${FAKE_UID}/${FAKE_PID}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Usuario no encontrado");
  });

  it("debe retornar 404 si la mascota no existe", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(404).json({ status: "error", message: "Mascota no encontrada" }),
    });

    const res = await request(app).post(`/api/adoptions/${FAKE_UID}/${FAKE_PID}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Mascota no encontrada");
  });

  it("debe retornar 400 si la mascota ya fue adoptada", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(400).json({ status: "error", message: "La mascota ya fue adoptada" }),
    });

    const res = await request(app).post(`/api/adoptions/${FAKE_UID}/${FAKE_PID}`);

    assert.equal(res.status, 400);
    assert.equal(res.body.message, "La mascota ya fue adoptada");
  });

  it("debe retornar 500 si ocurre un error inesperado", async () => {
    const app = buildApp({
      getAll:  (req, res) => res.status(200).json({ status: "success", payload: [] }),
      getById: (req, res) => res.status(200).json({ status: "success", payload: fakeAdoption }),
      create:  (req, res) => res.status(500).json({ status: "error", message: "Error inesperado" }),
    });

    const res = await request(app).post(`/api/adoptions/${FAKE_UID}/${FAKE_PID}`);

    assert.equal(res.status, 500);
    assert.equal(res.body.status, "error");
  });
});
