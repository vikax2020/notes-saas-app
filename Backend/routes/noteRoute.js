import express from "express";
import { createNote, getAllNotes, getSingleNote, updateNote, deleteNote } from "../controller/noteController.js";
import userMiddleware from "../middleware/userMiddleware.js"; // import karo

const router = express.Router();

// POST /notes/create
router.post("/create", userMiddleware, createNote);

// GET /notes
router.get("/", userMiddleware, getAllNotes);

// GET /notes/:id
router.get("/:id", userMiddleware, getSingleNote);

// PUT /notes/:id
router.put("/:id", userMiddleware, updateNote);

// DELETE /notes/:id
router.delete("/:id", userMiddleware, deleteNote);

export default router;
