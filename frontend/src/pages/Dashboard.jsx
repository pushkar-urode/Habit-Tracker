import { useEffect, useState } from "react";
import axios from "axios";
import HeatMap from "@uiw/react-heat-map";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");

  const fetchHabits = async () => {
    try {
      const { data } = await axios.get("/api/habits", {
        headers: {
          authorization: token,
        },
      });

      setHabits(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!title) return;

    try {
      await axios.post(
        "/api/habits",
        { title },
        {
          headers: {
            authorization: token,
          },
        },
      );

      setTitle("");

      fetchHabits();
    } catch (error) {
      console.log(error);
    }
  };

  const completeHabit = async (id) => {
    try {
      await axios.put(
        `/api/habits/${id}`,
        {},
        {
          headers: {
            authorization: token,
          },
        },
      );

      fetchHabits();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(`/api/habits/${id}`, {
        headers: {
          authorization: token,
        },
      });

      fetchHabits();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  const dateCounts = {};

  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => {
      if (dateCounts[date]) {
        dateCounts[date] += 1;
      } else {
        dateCounts[date] = 1;
      }
    });
  });

  const heatmapData = Object.keys(dateCounts).map((date) => ({
    date,
    count: dateCounts[date],
  }));

  const totalXP = habits.reduce((acc, habit) => acc + habit.xp, 0);

  return (
    /*
    <div
      className={`${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"} min-h-screen transition-all duration-300`}
    >
      <div className="max-w-6xl mx-auto p-6">
        <div
          className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-3xl p-8 shadow-xl mb-8 flex justify-between items-center`}
        >
          <div>
            <h1 className="text-5xl font-bold mb-2">Habit Tracker 🚀</h1>

            <p className="text-lg opacity-80">
              Stay consistent every single day
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-5 py-3 rounded-xl bg-purple-500 text-white"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            <button
              onClick={logout}
              className="px-5 py-3 rounded-xl bg-red-500 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 rounded-2xl shadow`}
          >
            <h2 className="text-xl font-bold mb-2">Total Habits</h2>

            <p className="text-4xl font-bold">{habits.length}</p>
          </div>

          <div
            className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 rounded-2xl shadow`}
          >
            <h2 className="text-xl font-bold mb-2">Total XP ⚡</h2>

            <p className="text-4xl font-bold text-yellow-500">{totalXP}</p>
          </div>

          <div
            className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 rounded-2xl shadow`}
          >
            <h2 className="text-xl font-bold mb-2">Longest Streak 🔥</h2>

            <p className="text-4xl font-bold text-green-500">
              {habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0}
            </p>
          </div>
        </div>

        <div
          className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 rounded-2xl shadow mb-8`}
        >
          <h2 className="text-2xl font-bold mb-4">Add Habit</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter habit..."
            /*  className="flex-1 border p-4 rounded-xl text-black" */ /*className={`flex-1 border p-4 rounded-xl ${darkMode ? "text-white" : "text-black"}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              onClick={addHabit}
              className="bg-blue-500 text-white px-8 rounded-xl"
            >
              Add
            </button>
          </div>
        </div>

        <div
          className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 rounded-2xl shadow mb-8 overflow-x-auto`}
        >
          <h2 className="text-2xl font-bold mb-6">Consistency Heatmap 📅</h2>

          <HeatMap
            value={heatmapData}
            width={900}
            rectSize={18}
            space={5}
            startDate={new Date("2026-01-01")}
            endDate={new Date("2026-12-31")}
            panelColors={{
              0: "#ebedf0",
              2: "#9be9a8",
              4: "#40c463",
              10: "#30a14e",
              20: "#216e39",
            }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <div
              key={habit._id}
              className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 rounded-2xl shadow-lg`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{habit.title}</h2>

                  <p className="opacity-70 mt-1">
                    🔥 {habit.streak} day streak
                  </p>

                  <p className="text-yellow-500 font-bold">⚡ {habit.xp} XP</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => completeHabit(habit._id)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl"
                >
                  Complete
                </button>

                <button
                  onClick={() => deleteHabit(habit._id)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  */
   <div
    className={`${
      darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
    } min-h-screen transition-all duration-300`}
  >
    <div className="max-w-6xl mx-auto px-4 py-6 md:p-6">
      {/* Header */}
      <div
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } rounded-3xl p-5 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row gap-5 justify-between md:items-center`}
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Habit Tracker 🚀
          </h1>

          <p className="text-base md:text-lg opacity-80">
            Stay consistent every single day
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-5 py-3 rounded-xl bg-purple-500 text-white w-full sm:w-auto"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            onClick={logout}
            className="px-5 py-3 rounded-xl bg-red-500 text-white w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } p-6 rounded-2xl shadow`}
        >
          <h2 className="text-xl font-bold mb-2">Total Habits</h2>
          <p className="text-3xl md:text-4xl font-bold">{habits.length}</p>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } p-6 rounded-2xl shadow`}
        >
          <h2 className="text-xl font-bold mb-2">Total XP ⚡</h2>
          <p className="text-3xl md:text-4xl font-bold text-yellow-500">
            {totalXP}
          </p>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } p-6 rounded-2xl shadow sm:col-span-2 md:col-span-1`}
        >
          <h2 className="text-xl font-bold mb-2">Longest Streak 🔥</h2>
          <p className="text-3xl md:text-4xl font-bold text-green-500">
            {habits.length > 0
              ? Math.max(...habits.map((h) => h.streak))
              : 0}
          </p>
        </div>
      </div>

      {/* Add Habit */}
      <div
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } p-6 rounded-2xl shadow mb-8`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Add Habit
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter habit..."
            className={`w-full flex-1 border p-4 rounded-xl ${
              darkMode ? "text-white bg-gray-800" : "text-black"
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={addHabit}
            className="bg-blue-500 text-white px-8 py-4 rounded-xl w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      </div>

      {/* Heatmap */}
      <div
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } p-6 rounded-2xl shadow mb-8`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Consistency Heatmap 📅
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <HeatMap
              value={heatmapData}
              width={900}
              rectSize={16}
              space={4}
              startDate={new Date("2026-01-01")}
              endDate={new Date("2026-12-31")}
              panelColors={{
                0: "#ebedf0",
                2: "#9be9a8",
                4: "#40c463",
                10: "#30a14e",
                20: "#216e39",
              }}
            />
          </div>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className={`${
              darkMode ? "bg-gray-900" : "bg-white"
            } p-6 rounded-2xl shadow-lg`}
          >
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold break-words">
                {habit.title}
              </h2>

              <p className="opacity-70 mt-1">
                🔥 {habit.streak} day streak
              </p>

              <p className="text-yellow-500 font-bold">
                ⚡ {habit.xp} XP
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => completeHabit(habit._id)}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl"
              >
                Complete
              </button>

              <button
                onClick={() => deleteHabit(habit._id)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default Dashboard;
