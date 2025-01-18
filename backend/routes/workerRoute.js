
import express from "express";
import Worker from "../models/worker.js";

const router = express.Router();

// Get all workers (filter by shopname if provided)
router.get("/", async (req, res) => {
  const { shopname } = req.query; // Optional query parameter to filter by shopname

  try {
    const filter = shopname ? { shopname } : {};
    const workers = await Worker.find(filter);
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new worker with shopname
router.post("/", async (req, res) => {
  const { shopname, name, slot, date } = req.body;

  try {
    // Check if the slot is already booked for this date
    const existingSlot = await Worker.findOne({ shopname, date, slot });

    if (existingSlot) {
      return res
        .status(400)
        .json({ message: `Slot ${slot} is already booked on ${date} for shop ${shopname}` });
    }

    const newWorker = new Worker({ shopname, name, slot, date });
    await newWorker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a worker's slot
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { shopname, name, slot, date } = req.body;

  try {
    // Check if the new slot is already booked for this date
    const existingSlot = await Worker.findOne({ shopname, date, slot, _id: { $ne: id } });

    if (existingSlot) {
      return res
        .status(400)
        .json({ message: `Slot ${slot} is already booked on ${date} for shop ${shopname}` });
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      id,
      { shopname, name, slot, date },
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

// Get available slots for a specific shop on a specific date
router.get("/:shopname/slots", async (req, res) => {
  const { shopname } = req.params;
  const { date } = req.query; // Date passed as a query parameter

  try {
    // Define all possible slots (example slots)
    const allSlots = ["09:00 am", "10:00 am", "11:00 am", "12:00 pm", "01:00 pm"];

    // Find booked slots for the shop on the specified date
    const bookedSlots = await Worker.find({ shopname, date }).select("slot -_id");
    const bookedSlotList = bookedSlots.map((s) => s.slot);

    // Filter available slots
    const availableSlots = allSlots.filter((slot) => !bookedSlotList.includes(slot));

    res.status(200).json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
