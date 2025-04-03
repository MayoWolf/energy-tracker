import { useState, useEffect } from "react";

const DRINKS = [
  {
    name: "Celsius",
    caffeine: 200,
    image: "https://i.ibb.co/7JH5Ndbd/celsius.png"
  },
  {
    name: "Bang",
    caffeine: 300,
    image: "https://i.ibb.co/zWskSnmW/bang.png"
  },
  {
    name: "Red Bull",
    caffeine: 114,
    image: "https://i.ibb.co/cXD0LPYs/redbull.png"
  },
  {
    name: "Yerba Mate",
    caffeine: 150,
    image: "https://i.ibb.co/DHzjv8M1/yerba.png"
  },
  {
    name: "Monster",
    caffeine: 160,
    image: "https://i.ibb.co/4RtNvNQQ/monster.png"
  },
  {
    name: "Coffee",
    caffeine: 95,
    image: "https://i.ibb.co/4nJW3982/black-coffee-150x150.png"
  },
];

export default function CaffeineTracker() {
  const today = new Date().toDateString();

  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("lastTrackedDate", today);
    localStorage.setItem("username", username);
  }, [history, today, username]);

  useEffect(() => {
    const lastTracked = localStorage.getItem("lastTrackedDate");
    if (lastTracked && lastTracked !== today) {
      setHistory(prev => ({
        ...prev,
        [today]: []
      }));
    }
  }, [today]);

  const addDrink = (drink) => {
    if (!username) {
      alert("Please enter your name before logging a drink.");
      return;
    }
    const todayLog = history[today] || [];
    const updated = {
      ...history,
      [today]: [...todayLog, {
        ...drink,
        user: username,
        time: new Date().toLocaleTimeString()
      }]
    };
    setHistory(updated);
  };

  const resetLog = () => {
    const confirmReset = window.confirm("Are you sure you want to reset today's log?");
    if (confirmReset) {
      setHistory(prev => ({
        ...prev,
        [today]: []
      }));
    }
  };

  const todayLog = history[today] || [];
  const totalCaffeine = todayLog.filter(d => d.user === username).reduce((sum, d) => sum + d.caffeine, 0);
  const totalDrinks = todayLog.filter(d => d.user === username).length;

  const leaderboardData = {};
  Object.values(history).forEach(day => {
    day.forEach(entry => {
      leaderboardData[entry.user] = (leaderboardData[entry.user] || 0) + entry.caffeine;
    });
  });

  const leaderboard = Object.entries(leaderboardData)
    .sort((a, b) => b[1] - a[1])
    .map(([user, total]) => ({ user, total }));

  return (
    <div className="min-h-screen bg-neutral-950 text-orange-400 p-4">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>

      <h1 className="text-3xl font-bold mb-4 text-orange-400">☕ Energy Tracker</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Enter your name:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 rounded-xl bg-neutral-800 text-orange-400 border border-neutral-600 focus:outline-none"
          placeholder="Your name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DRINKS.map((drink) => (
          <button
            key={drink.name}
            onClick={() => addDrink(drink)}
            className="bg-neutral-800 hover:bg-neutral-700 transition rounded-2xl p-4 shadow-xl text-left text-orange-400"
          >
            <div className="w-40 h-40 mx-auto mb-2 overflow-hidden rounded-xl">
              <img
                src={drink.image}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">{drink.name}</h2>
            <p className="text-sm">{drink.caffeine} mg caffeine</p>
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 p-4 rounded-2xl shadow-md mb-6 text-orange-400">
        <h3 className="text-2xl font-bold mb-2">📊 Today's Stats</h3>
        <p>Total Drinks: {totalDrinks}</p>
        <p>Total Caffeine: {totalCaffeine} mg</p>

        <button
          onClick={resetLog}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          🔄 Reset Today
        </button>
      </div>

      <div className="bg-neutral-900 p-4 rounded-2xl shadow-md text-orange-400 mb-6">
        <h3 className="text-2xl font-bold mb-4">🏆 Leaderboard</h3>
        {leaderboard.map(({ user, total }, index) => (
          <div key={user} className="mb-1">
            <span className="font-semibold">{index + 1}. {user}</span>: {total} mg
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 p-4 rounded-2xl shadow-md text-orange-400">
        <h3 className="text-2xl font-bold mb-4">📚 Drink History</h3>

        {Object.keys(history)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date) => {
            const dayLog = history[date];
            const dayTotal = dayLog.reduce((sum, d) => sum + d.caffeine, 0);

            return (
              <div key={date} className="mb-6">
                <h4 className="text-xl font-semibold mb-2">
                  {date === today ? "📅 Today" : date}
                </h4>
                <ul className="list-disc list-inside text-sm mb-1">
                  {dayLog.map((drink, index) => (
                    <li key={index}>
                      {drink.name} ({drink.caffeine}mg) by {drink.user} at {drink.time}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium">
                  Total: {dayTotal} mg
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
