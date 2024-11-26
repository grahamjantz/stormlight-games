import React, { useState, useEffect } from "react";
import { heraldsAndOrders } from "../utils";

const HeraldSurgeGuessingGame = () => {
  const [currentHerald, setCurrentHerald] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [selectedSurges, setSelectedSurges] = useState([]);
  const [showCount, setShowCount] = useState(() =>
    Object.fromEntries(heraldsAndOrders.map((herald) => [herald.name, 0]))
  );

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const generateNewQuestion = () => {
    // Find the heralds with the lowest show count
    const minShowCount = Math.min(...Object.values(showCount));
    const leastShownHeralds = heraldsAndOrders.filter(
      (herald) => showCount[herald.name] === minShowCount
    );

    // Randomly pick one of the least shown heralds
    const newHerald =
      leastShownHeralds[
        Math.floor(Math.random() * leastShownHeralds.length)
      ];
    setCurrentHerald(newHerald);

    // Update the show count for the selected herald
    setShowCount((prevShowCount) => ({
      ...prevShowCount,
      [newHerald.name]: prevShowCount[newHerald.name] + 1,
    }));

    // Generate surge options
    const allSurges = [
      "Gravitation",
      "Adhesion",
      "Division",
      "Abrasion",
      "Progression",
      "Illumination",
      "Transformation",
      "Transportation",
      "Cohesion",
      "Tension",
    ];

    const filteredSurges = allSurges.filter(
      (surge) => !newHerald.surges.includes(surge)
    );
    const wrongSurges = shuffleArray(filteredSurges).slice(0, 2);
    const combinedOptions = shuffleArray([...newHerald.surges, ...wrongSurges]);

    setOptions(combinedOptions);
    setFeedback("");
    setSelectedSurges([]);
  };

  const handleSurgeSelect = (surge) => {
    if (selectedSurges.includes(surge)) {
      // Deselect the surge
      setSelectedSurges((prev) => prev.filter((s) => s !== surge));
    } else if (selectedSurges.length < 2) {
      // Select the surge (if fewer than 2 selected)
      setSelectedSurges((prev) => [...prev, surge]);
    }
  };

  const handleSubmit = () => {
    if (selectedSurges.length === 2) {
      const isCorrect =
        selectedSurges.every((surge) => currentHerald.surges.includes(surge)) &&
        selectedSurges.length === currentHerald.surges.length;

      if (isCorrect) {
        setFeedback("Correct!");
      } else {
        setFeedback(
          `Incorrect. The correct surges are ${currentHerald.surges.join(
            " and "
          )}.`
        );
      }

      setTimeout(() => {
        generateNewQuestion();
      }, 2000);
    } else {
      setFeedback("Please select exactly two surges before submitting.");
    }
  };

  if (!currentHerald) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col items-center gap-6 p-6">
      <div className="max-w-80 w-full flex flex-col items-center border p-6 bg-gray-400 rounded shadow-lg text-[#252525]">
        <div className="relative w-full">
          <img
            src={currentHerald.image}
            alt={currentHerald.name}
            className="w-full object-cover rounded shadow"
          />
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-semibold rounded p-4">
              {feedback}
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold italic text-center mt-4">
          {currentHerald.name}
        </h2>
        <p className="text-gray-700 text-center mt-2">{currentHerald.order}</p>
      </div>
      <div className="w-full max-w-80 flex flex-wrap justify-center mt-4">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-1/2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
              selectedSurges.includes(option)
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
            onClick={() => handleSurgeSelect(option)}
            aria-pressed={selectedSurges.includes(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="px-6 py-3 bg-green-500 text-white rounded-lg mt-4 hover:bg-green-600 transition-transform duration-200 hover:scale-105"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default HeraldSurgeGuessingGame;
