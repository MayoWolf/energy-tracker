import { useState, useEffect } from "react";

const DRINKS = [
  {
    name: "Celsius",
    caffeine: 200,
    image: "https://i.imgur.com/90TfeGW.png"
  },
  {
    name: "Bang",
    caffeine: 300,
    image: "https://i.imgur.com/90TfeGW.png"
  },
  {
    name: "Red Bull",
    caffeine: 114,
    image: "https://i.imgur.com/90TfeGW.png"
  },
  {
    name: "Yerba Mate",
    caffeine: 150,
    image: "https://i.imgur.com/Bb9wl9P.png"
  },
  {
    name: "Monster",
    caffeine: 160,
    image: "https://i.imgur.com/7oKqXVo.png"
  },
];

export default function CaffeineTracker() {
  const [drinkLog, setDrinkLog] = useState(() => {
    const saved = localStorage.getItem("drinkLog");
    const parsed = saved ? JSON.parse(saved) : [];
    const today = new Date().toDateString();
    return parsed.filter(entry => entry.date === today);
  });

  useEffect(() => {
    localStorage.setItem("drinkLog", JSON.stringify(drinkLog));
  }, [drinkLog]);

  const addDrink = (drink) => {
    setDrinkLog([...drinkLog, { ...drink, date: new Date().toDateString() }]);
  };

  const totalCaffeine = drinkLog.reduce((sum, d) => sum + d.caffeine, 0);
  const totalDrinks = drinkLog.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>

      <h1 className="text-3xl font-bold mb-4">☕ Energy Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DRINKS.map((drink) => (
          <button
            key={drink.name}
            onClick={() => addDrink(drink)}
            className="bg-neutral-800 hover:bg-neutral-700 transition rounded-2xl p-4 shadow-xl text-left"
          >
            <div className="w-40 h-40 mx-auto mb-2 overflow-hidden rounded-xl">
  <img
    src={drink.image}
    alt={drink.name}
    className="w-full h-full object-cover"
  />
</div>

            <h2 className="text-xl font-semibold">{drink.name}</h2>
            <p className="text-sm text-neutral-300">{drink.caffeine} mg caffeine</p>
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 p-4 rounded-2xl shadow-md">
        <h3 className="text-2xl font-bold mb-2">📊 Today's Stats</h3>
        <p>Total Drinks: {totalDrinks}</p>
        <p>Total Caffeine: {totalCaffeine} mg</p>
      </div>
    </div>
  );
}