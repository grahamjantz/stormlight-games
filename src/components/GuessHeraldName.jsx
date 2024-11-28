import React, { useState } from "react";

// Dynamically import all images from the assets/heralds folder
const images = import.meta.glob("/public/heralds/*.jpg", { eager: true });

const GuessHeraldName = () => {
  const imageArray = Object.entries(images).map(([path, module]) => {
    const fileName = path.split("/").pop().replace(".jpg", ""); // Extract name
    return { src: module.default, name: fileName };
  });

  // const imageArray = [
  //   "Battar",
  //   "Chanarach",
  //   "Ishar",
  //   "Jezrien",
  //   "Kalak",
  //   "Nale",
  //   "Pailiah",
  //   "Shalash",
  //   "Talenel",
  //   "Vedel"
  // ].map((name) => ({
  //   src: `/heralds/${name}.jpg`, // Public folder URL
  //   name,
  // }));

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const [shuffledImages, setShuffledImages] = useState(shuffleArray(imageArray));
  // console.log(shuffledImages)

  // Track how many times each image has been shown
  const [shownCounts, setShownCounts] = useState(
    Object.fromEntries(imageArray.map(({ name }) => [name, 0]))
  );


  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  // Function to get the next image based on shownCounts
  const getNextImage = () => {
    const leastShown = Math.min(...Object.values(shownCounts)); // Find the minimum count
    const candidates = shuffledImages.filter(
      (image) => shownCounts[image.name] === leastShown
    );
    return candidates[Math.floor(Math.random() * candidates.length)]; // Randomly pick one
  };

  const [currentImage, setCurrentImage] = useState(getNextImage());

  const handleGuess = (e) => {
    e.preventDefault();

    if (guess.trim().toLowerCase() === currentImage.name.toLowerCase()) {
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. The correct answer is ${currentImage.name}.`);
    }

    setTimeout(() => {
      setFeedback(""); // Clear feedback

      setShownCounts((prevCounts) => {
        const updatedCounts = {
          ...prevCounts,
          [currentImage.name]: prevCounts[currentImage.name] + 1,
        };

        // Check if all images have been shown at least once
        const allShownOnce = Object.values(updatedCounts).every(
          (count) => count > 0
        );

        if (allShownOnce) {
          // Reshuffle the array and reset counts
          setShuffledImages(shuffleArray(imageArray));
          setCurrentImage(shuffleArray(imageArray)[0]); // Start with a new random image
          return Object.fromEntries(
            imageArray.map(({ name }) => [name, 0]) // Reset counts to 0
          );
        }

        // Select the next image dynamically
        setCurrentImage(getNextImage());

        return updatedCounts; // Update counts
      });

      setGuess(""); // Reset guess input field
    }, 2000);
  };

  return (
    <div className="max-w-80 w-80 flex flex-col items-center gap-4 border p-4 bg-gray-400 rounded text-[#252525]">
      <div className="relative w-full mb-4">
        <img
          src={currentImage.src}
          alt="Guess who?"
          className="w-full object-cover rounded shadow"
        />

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
