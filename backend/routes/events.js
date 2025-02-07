const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const zod = require("zod");
const { Event } = require("../db");
const mongoose = require("mongoose");

// Define Zod validation schema
const eventBody = zod.object({
    eventName: zod.string(),
    description: zod.string(),
    authorName: zod.string(),
    category: zod.string(),
    eventDate: zod.string(),
    capacity: zod.number().positive(),
});

router.post("/create-event", authMiddleware, async (req, res) => {
    const parsedBody = eventBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(411).json({ message: "Incorrect inputs" });
    }

    try {
        const event = await Event.create({
            ...req.body,
            eventDate: new Date(req.body.eventDate), // Convert string to Date object
            joinedCount: 0, // Ensure joinedCount is 0 when event is created
        });

        res.json({ message: "Event created successfully", event });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/bulk", async (req, res) => {
    try {
      // Fetch only events where joinedCount is less than capacity
      const events = await Event.find({
        $expr: { $lt: ["$joinedCount", "$capacity"] }, // Properly compare joinedCount and capacity
      }).sort({ eventDate: 1 });
  
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

  router.post("/join/:eventId", authMiddleware, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.userId; // ✅ Use req.userId, not req.user.id

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the user has already joined the event
        if (event.joinedUsers.includes(userId)) {
            return res.status(400).json({ message: "You have already joined this event." });
        }

        // Check if the event is full
        if (event.joinedCount >= event.capacity) {
            return res.status(400).json({ message: "Event is full" });
        }

        // Add user to joinedUsers list
        event.joinedUsers.push(userId);
        event.joinedCount += 1;
        await event.save();

        res.json({ success: true, message: "Joined event successfully" });
    } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

  

module.exports = router;
