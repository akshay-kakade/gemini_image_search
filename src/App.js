import React, { useState } from "react";

const App = () => {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const surpriseOpetions = [
    "Dose the image whale?",
    "Is the image fabulosly pink?",
    "Dose the image have puppise?",
    "Discribe the image.",
    "How many people in image?",
    "Is the image a work of art?",
    "What emotions does the image evoke? ",
    "Is there a hidden story behind the image? ",
    "Guess the location!",
    "Is the image symmetrical?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOpetions[Math.floor(Math.random() * surpriseOpetions.length)];
    setValue(randomValue);
  };

  const uploadImage = async (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setImage(e.target.files[0]);

    const imageUrl = URL.createObjectURL(selectedImage);
    console.log("Image URL:", imageUrl);

    try {
      const options = {
        method: "POST",
        body: formData,
      };

      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
      setError("Something didn't work! Please try  again.");
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Error! Must have an existing image!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      };
     const response =  await fetch('http://localhost:8000/gemini', options)
     const data = await response.text()
     setResponse(data)
    } catch (err) {
      console.log(err);
      setError("Something didn't work! Please try again.");
    }
  };

  const clear = () => {
    setImage(null);
    setValue("");
    setResponse("");
    setError("");
  };

  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container">
          <img
            className="image"
            src={image ? URL.createObjectURL(image) : ""}
            alt="Images"
          />
        </div>

        {!response && <p className="extra-info ">
          <span>
            <label htmlFor="files">Upload an image</label>
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
            />
          </span>
          to ask question about.
        </p>}
        <p>
          What do you want to know about image?
          <button className="surprise" onClick={surprise} disabled={response}>
            {" "}
            Surprise me
          </button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="What is inn image..."
            onChange={(e) => setValue(e.target.value)}
          />
          {!response && !error && (
            <button onClick={analyzeImage}>Ask me</button>
          )}
          {(response || error) && <button onClick={clear} >Clear</button>}
        </div>
        {error && <p>{error}</p>}
        {response && <p className="answer">{response}</p>}
      </section>
    </div>
  );
};

export default App;
