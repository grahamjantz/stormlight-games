import React, { useState, useEffect } from 'react';
import { heraldsAndOrders } from '../utils'; // Import the heraldsAndOrders data

const RadiantOrderGame = () => {
  const [currentGlyph, setCurrentGlyph] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  // Track incorrect guesses and show counts for each glyph
  const [wrongAnswerCounts, setWrongAnswerCounts] = useState(
    Object.fromEntries(heraldsAndOrders.map(({ radiantGlyph }) => [radiantGlyph, 0]))
  );

  const [showCounts, setShowCounts] = useState(
    Object.fromEntries(heraldsAndOrders.map(({ radiantGlyph }) => [radiantGlyph, 0]))
  );

  const selectNextGlyph = () => {
    // Create a weighted array based on wrong answer counts and adjust for show counts
    const weightedGlyphs = heraldsAndOrders.flatMap(({ radiantGlyph }) =>
      Array(Math.max(0, wrongAnswerCounts[radiantGlyph] + 1 - showCounts[radiantGlyph])).fill(radiantGlyph)
    );
  
    // If weightedGlyphs is empty (all glyphs exhausted), fallback to a random glyph
    if (weightedGlyphs.length === 0) {
      return heraldsAndOrders[Math.floor(Math.random() * heraldsAndOrders.length)].radiantGlyph;
    }
  
    // Randomly pick a weighted radiant glyph
    const randomGlyph = weightedGlyphs[Math.floor(Math.random() * weightedGlyphs.length)];
    return randomGlyph;
  };
  

  useEffect(() => {
    // Select a random radiant glyph to start the game
    const initialGlyph = selectNextGlyph();
    setCurrentGlyph(initialGlyph);
  }, []);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback('Please enter an answer!');
      return;
    }

    const correctOrder = heraldsAndOrders.find(
      (herald) => herald.radiantGlyph === currentGlyph
    ).order;

    if (userAnswer.toLowerCase() === correctOrder.toLowerCase()) {
      setFeedback('Correct! Well done.');
    } else {
      setFeedback(`Incorrect! The correct answer is ${correctOrder}.`);

      // Update the wrong answer count for the current glyph
      setWrongAnswerCounts((prevCounts) => ({
        ...prevCounts,
        [currentGlyph]: prevCounts[currentGlyph] + 1,
      }));
    }

    // Update the show count for the current glyph
    setShowCounts((prevCounts) => ({
      ...prevCounts,
      [currentGlyph]: prevCounts[currentGlyph] + 1,
    }));

    // Show the next radiant glyph after a delay
    setTimeout(() => {
      const nextGlyph = selectNextGlyph();
      setCurrentGlyph(nextGlyph);
      setUserAnswer('');
      setFeedback('');
    }, 1500);
  };

  return (
    <div className="max-w-80 w-80 flex flex-col items-center gap-4 border pb-4 bg-gray-400 rounded text-[#252525]">
      {currentGlyph && (
        <div className="glyph-container mb-4 text-center relative">
          <img
            src={currentGlyph}
            alt="Radiant Order Glyph"
            className="w-10/12 mx-auto mb-4 border border-gray-400 rounded "
          />
          {feedback && (
            <div className="w-full feedback absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-bold rounded">
              {feedback}
            </div>
          )}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} className="flex flex-col items-center gap-4 w-full">
        <div className="w-10/12 flex justify-center ">
          <input
            type="text"
            value={userAnswer}
            onChange={handleAnswerChange}
            placeholder="Type the radiant order name"
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

export default RadiantOrderGame;
