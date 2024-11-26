import React, { useState } from "react";

// Dynamically import all images from the assets/heralds folder
const images = import.meta.glob("/src/assets/heralds/*.jpg", { eager: true });

const GuessHeraldName = () => {
  // Prepare an array of image objects with file paths and names
  const imageArray = Object.entries(images).map(([path, module]) => {
    const fileName = path.split("/").pop().replace(".jpg", ""); // Extract name
    return { src: module.default, name: fileName };
  });

  const [currentImage, setCurrentImage] = useState(
    imageArray[Math.floor(Math.random() * imageArray.length)]
  );
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  // Track incorrect guesses for each image
  const [wrongAnswerCounts, setWrongAnswerCounts] = useState(
    Object.fromEntries(imageArray.map(({ name }) => [name, 0]))
  );

  const handleGuess = (e) => {
    e.preventDefault(); // Prevent form submission

    if (guess.trim().toLowerCase() === currentImage.name.toLowerCase()) {
      setFeedback("Correct!");
      // Decrement the count for the current image if greater than 1
      setWrongAnswerCounts((prevCounts) => ({
        ...prevCounts,
        [currentImage.name]: Math.max(prevCounts[currentImage.name] - 1, 0),
      }));
    } else {
      setFeedback(`Incorrect. The correct answer is ${currentImage.name}.`);
      // Increment the count for the current image
      setWrongAnswerCounts((prevCounts) => ({
        ...prevCounts,
        [currentImage.name]: prevCounts[currentImage.name] + 1,
      }));
    }

    // Wait 2 seconds before resetting feedback and selecting a new image
    setTimeout(() => {
      setFeedback(""); // Reset feedback
      setCurrentImage(selectNextImage()); // Select a new image
      setGuess(""); // Reset the guess input field
    }, 2000); // 2 seconds delay
  };

  const selectNextImage = () => {
    // Calculate total wrong answers
    const totalWrong = Object.values(wrongAnswerCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Assign weights to images based on wrong answer counts
    const weightedImages = imageArray.flatMap((image) =>
      Array(wrongAnswerCounts[image.name] + 1).fill(image)
    );

    // Randomly pick a weighted image
    return weightedImages[Math.floor(Math.random() * weightedImages.length)];
  };

  return (
    <div className="max-w-80 w-80 flex flex-col items-center gap-4 border p-4 bg-gray-400 rounded text-[#252525]">
      {/* Container for image and feedback */}
      <div className="relative w-full mb-4">
        <img
          src={currentImage.src}
          alt="Guess who?"
          className="w-full object-cover rounded shadow"
        />
        
        {/* Overlay feedback */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-semibold rounded">
            {feedback}
          </div>
        )}
      </div>

      <form onSubmit={handleGuess} className="flex flex-col items-center gap-4">
        <div className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Enter name"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
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

export default GuessHeraldName;
