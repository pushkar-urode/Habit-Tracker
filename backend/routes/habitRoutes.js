import express from "express";

import {
  createHabit,
  getHabits,
  completeHabit,
  deleteHabit,
} from "../controllers/habitController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createHabit);

router.get("/", authMiddleware, getHabits);

router.put("/:id", authMiddleware, completeHabit);

router.delete("/:id", authMiddleware, deleteHabit);

export default router;
