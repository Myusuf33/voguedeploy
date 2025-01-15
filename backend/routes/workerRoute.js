import express from "express";
import Worker from "../models/worker.js";

const router = express.Router();

// Get all workers
router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new worker
router.post("/", async (req, res) => {
  const { name, slot, date } = req.body;

  try {
    const newWorker = new Worker({ name, slot, date });
    await newWorker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a worker
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, slot, date } = req.body;

  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      id,
      { name, slot, date },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(updatedWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a worker
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWorker = await Worker.findByIdAndDelete(id);

    if (!deletedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
