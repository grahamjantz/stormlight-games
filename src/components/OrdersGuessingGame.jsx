import React, { useState } from "react";
import { heraldsAndOrders } from "../utils";

const OrdersGuessingGame = () => {
  // Initialize shownCounts with each herald's name starting at 0
  const [shownCounts, setShownCounts] = useState(
    Object.fromEntries(heraldsAndOrders.map((herald) => [herald.name, 0]))
  );

  // State for the current herald and the rest of the game
  const [currentHerald, setCurrentHerald] = useState(
    heraldsAndOrders[Math.floor(Math.random() * heraldsAndOrders.length)]
  );
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);

  // Helper function to select the next herald, ensuring all are shown at least once
  const getNextHerald = () => {
    // Update shownCounts for the current herald
    setShownCounts((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [currentHerald.name]: prevCounts[currentHerald.name] + 1,
      };

      // Check if all heralds have been shown at least once
      const allShownOnce = Object.values(updatedCounts).every((count) => count > 0);

      if (allShownOnce) {
        // Reset shownCounts and shuffle heralds
        setShownCounts(
          Object.fromEntries(heraldsAndOrders.map((herald) => [herald.name, 0]))
        );
      }

      return updatedCounts;
    });

    // Select the next herald not shown the least recently
    const availableHeralds = heraldsAndOrders.filter(
      (herald) => shownCounts[herald.name] === 0
    );
    return availableHeralds.length > 0
      ? availableHeralds[Math.floor(Math.random() * availableHeralds.length)]
      : heraldsAndOrders[Math.floor(Math.random() * heraldsAndOrders.length)];
  };

  const handleGuess = (e) => {
    e.preventDefault();

    if (guess.trim().toLowerCase() === currentHerald.order.toLowerCase()) {
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. The correct answer is ${currentHerald.order}.`);
    }

    setGuess("");
    setShowHint(false);

    // Wait 2 seconds before resetting feedback and selecting a new herald
    setTimeout(() => {
      setFeedback(""); // Reset feedback
      setCurrentHerald(getNextHerald()); // Select a new herald
    }, 2000); // 2 seconds delay
  };

  const handleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 p-6">
      <div className="max-w-80 w-80 flex flex-col items-center border p-4 bg-gray-400 rounded text-[#252525]">
        <div className="relative w-full">
          {/* Image with feedback overlay */}
          <img
            src={currentHerald.image}
            alt={currentHerald.name}
            className="w-full object-cover rounded shadow"
          />

          {/* Overlay feedback */}
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-semibold rounded">
              {feedback}
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold italic">{currentHerald.name}</h2>
        {showHint ? (
          <p
            className="w-full text-md italic text-gray-700 text-center hover:cursor-pointer"
            onClick={handleHint}
          >
            {currentHerald.description}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleHint}
            className="text-gray-700 px-2 rounded-full hover:underline"
          >
            Show Hint
          </button>
        )}
      </div>

      <form onSubmit={handleGuess} className="flex flex-col items-center gap-4">
        <div className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Enter order name"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="border rounded-full rounded-r-none px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-full rounded-l-none hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrdersGuessingGame;
