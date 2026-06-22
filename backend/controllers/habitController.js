import Habit from "../models/Habit.js";

export const createHabit = async (req, res) => {

  try {

    const { title } = req.body;

    if(!title) {
      return res.status(400).json({
        message: "Title required"
      });
    }

    const habit = await Habit.create({
      title,
      user: req.user.id,
      streak: 0,
      xp: 0,
      completedDates: []
    });

    res.status(201).json(habit);

  } catch(error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const getHabits = async (req, res) => {

  try {

    const habits = await Habit.find({
      user: req.user.id
    });

    res.json(habits);

  } catch(error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const completeHabit = async (req, res) => {

  try {

    const habit = await Habit.findById(req.params.id);

    if(!habit) {
      return res.status(404).json({
        message: "Habit not found"
      });
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    if(!habit.completedDates.includes(today)) {

      habit.completedDates.push(today);

      habit.streak += 1;

      habit.xp += 10;

      await habit.save();
    }

    res.json(habit);

  } catch(error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const deleteHabit = async (req, res) => {

  try {

    await Habit.findByIdAndDelete(req.params.id);

    res.json({
      message: "Habit deleted"
    });

  } catch(error) {

    res.status(500).json({
      message: error.message
    });

  }
};