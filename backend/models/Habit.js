import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  streak: {
    type: Number,
    default: 0
  },

  xp: {
    type: Number,
    default: 0
  },

  completedDates: {
    type: [String],
    default: []
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, {
  timestamps: true
});

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;