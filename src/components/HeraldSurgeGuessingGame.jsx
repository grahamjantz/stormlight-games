// src/components/HeraldSurgeGuessingGame.jsx
import React, { useState, useEffect } from "react";
import { heraldsAndOrders } from "../utils";

const HeraldSurgeGuessingGame = () => {
  const [currentHerald, setCurrentHerald] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [selectedSurges, setSelectedSurges] = useState([]);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const generateNewQuestion = () => {
    const newHerald =
      heraldsAndOrders[Math.floor(Math.random() * heraldsAndOrders.length)];
    setCurrentHerald(newHerald);

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
    <div className="w-full flex flex-col items-center gap-4 p-6">
      <div className="max-w-80 w-80 flex flex-col items-center border p-4 bg-gray-400 rounded text-[#252525]">
        <div className="w-full relative">
          <img
            src={currentHerald.image}
            alt={currentHerald.name}
            className="w-full object-cover rounded shadow"
          />
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl p-4 rounded">
              {feedback}
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold italic">{currentHerald.name}</h2>
        <p className="text-gray-700 text-center">{currentHerald.order}</p>
      </div>
      <div className="w-full max-w-80 flex flex-wrap justify-center">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-1/2 px-4 py-2 border rounded ${
              selectedSurges.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleSurgeSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded mt-4"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default HeraldSurgeGuessingGame;
