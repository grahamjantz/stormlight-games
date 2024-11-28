import React, { useState, useEffect } from 'react';
import { heraldsAndOrders } from '../utils'; // Import the heraldsAndOrders data

const RadiantSprenGame = () => {
  const [currentHerald, setCurrentHerald] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  // Track incorrect guesses for each spren
  const [wrongAnswerCounts, setWrongAnswerCounts] = useState(
    Object.fromEntries(heraldsAndOrders.map(({ spren }) => [spren, 0]))
  );

  // Track how many times to show a spren (to control frequency based on incorrect guesses)
  const [showCounts, setShowCounts] = useState(
    Object.fromEntries(heraldsAndOrders.map(({ spren }) => [spren, 0]))
  );

  // Select the next radiant herald based on the wrong answer count and show counts
  const selectNextHerald = () => {
    // Create a weighted array based on wrong answer counts and show counts
    const weightedHeralds = heraldsAndOrders.flatMap(({ spren }) =>
      Array(Math.max(0, wrongAnswerCounts[spren] + 1 - showCounts[spren])).fill(spren)
    );

    // If weightedHeralds is empty (all glyphs exhausted), fallback to a random herald
    if (weightedHeralds.length === 0) {
      return heraldsAndOrders[Math.floor(Math.random() * heraldsAndOrders.length)].spren;
    }

    // Randomly pick a weighted radiant herald
    const randomHerald = weightedHeralds[Math.floor(Math.random() * weightedHeralds.length)];
    return randomHerald;
  };

  useEffect(() => {
    // Select a random radiant herald to start the game
    const initialHerald = selectNextHerald();
    setCurrentHerald(initialHerald);
  }, []);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback('Please enter an answer!');
      return;
    }

    const correctSpren = heraldsAndOrders.find(
      (herald) => herald.spren.toLowerCase() === currentHerald.toLowerCase()
    ).spren;

    if (userAnswer.toLowerCase() === correctSpren.toLowerCase()) {
      setFeedback('Correct! Well done.');
      // Reset show count for the correct spren
      setShowCounts((prevCounts) => ({
        ...prevCounts,
        [currentHerald]: 0,
      }));
    } else {
      setFeedback(`Incorrect! The correct answer is ${correctSpren}.`);
      // Increment the wrong answer count for the current spren
      setWrongAnswerCounts((prevCounts) => ({
        ...prevCounts,
        [currentHerald]: prevCounts[currentHerald] + 1,
      }));
      // Increment the show count to ensure it is shown again
      setShowCounts((prevCounts) => ({
        ...prevCounts,
        [currentHerald]: prevCounts[currentHerald] + 1,
      }));
    }

    // Show the next radiant herald after a delay
    setTimeout(() => {
      const nextHerald = selectNextHerald();
      setCurrentHerald(nextHerald);
      setUserAnswer('');
      setFeedback('');
    }, 1500);
  };

  return (
    <div className="max-w-80 w-80 flex flex-col items-center gap-4 border pb-4 bg-gray-400 rounded text-[#252525]">
      {currentHerald && (
        <div className="herald-container mb-4 text-center relative">
          <img
            src={heraldsAndOrders.find(herald => herald.spren === currentHerald)?.radiantGlyph}
            alt="Radiant Order Glyph"
            className="w-10/12 mx-auto mb-4 border border-gray-400 rounded"
          />
          <h3 className="text-xl font-semibold">{heraldsAndOrders.find(herald => herald.spren === currentHerald)?.order}</h3>
          {feedback && (
            <div className="w-full feedback absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-bold rounded">
              {feedback}
            </div>
          )}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} className="flex flex-col items-center gap-4 w-full">
        <div className="w-10/12 flex justify-center">
          <input
            type="text"
            value={userAnswer}
            onChange={handleAnswerChange}
            placeholder="Type the spren name"
            className="w-full border rounded-full rounded-r-none px-4 py-2 text-white"
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

export default RadiantSprenGame;

