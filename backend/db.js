require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose.connect(url);

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    length: 10,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },
});

const User = mongoose.model("User", userSchema);

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  authorName: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  eventDate: { type: Date, required: true },
  capacity: { type: Number, required: true },
  joinedCount: { type: Number, default: 0 },
  joinedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store user IDs
});

const Event = mongoose.model("Event", eventSchema);

module.exports = { User, Event };
