import React, { useState, useEffect } from 'react';
import { surges } from '../utils';  // Import the surges array

const SurgesGuessingGame = () => {
  const [currentSurge, setCurrentSurge] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [showDescription, setShowDescription] = useState(false);  // State to control description visibility

  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Shuffle an array randomly
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Generate a new question with a random surge and options
  const generateNewQuestion = () => {
    const randomSurge = surges[Math.floor(Math.random() * surges.length)];
    setCurrentSurge(randomSurge);

    const wrongOptions = surges
      .filter(surge => surge.name !== randomSurge.name) // Remove the correct surge
      .slice(0, 3); // Take 3 wrong options
    const allOptions = shuffleArray([randomSurge, ...wrongOptions]); // Combine and shuffle
    setOptions(allOptions);
    setFeedback('');
    setSelectedOption('');
  };

  // Handle the option selection and provide instant feedback
  const handleOptionSelect = (surgeName) => {
    setSelectedOption(surgeName);

    const isCorrect = surgeName === currentSurge.name;
    if (isCorrect) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer is ${currentSurge.name}.`);
    }

    // Wait for 2 seconds before generating a new question after feedback
    setTimeout(() => {
      generateNewQuestion();
    }, 2000);
  };

  // Toggle the description visibility
  const toggleDescription = () => {
    setShowDescription((prevState) => !prevState);
  };

  if (!currentSurge) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col items-center gap-4 p-6">
      <div className="relative max-w-80 w-80 flex flex-col items-center border p-4 bg-gray-400 rounded text-[#252525]">
        {/* Surge Image and Description Overlay */}
        <div className="relative w-full">
          {/* Surge Image */}
          <img src={currentSurge.glyph} alt={currentSurge.name} className="w-full object-contain mb-4" />

          {/* Surge description overlay */}
          {showDescription && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white p-4 rounded">
              <h2 className="text-md italic">{currentSurge.description}</h2>
            </div>
          )}
        </div>

        {/* Toggle Button for Description */}
        <button
          onClick={toggleDescription}
          className="mb-2 text-blue-500 hover:text-blue-700"
        >
          {showDescription ? 'Hide Description' : 'Show Description'}
        </button>

        {/* Feedback overlay */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl p-4 rounded">
            {feedback}
          </div>
        )}
      </div>

      <div className="w-full max-w-80 flex flex-wrap justify-center">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-1/2 px-4 py-2 border rounded ${
              selectedOption === option.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleOptionSelect(option.name)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurgesGuessingGame;
