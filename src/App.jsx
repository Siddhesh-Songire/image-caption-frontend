import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import bgvideo from "./assets/pexels-cottonbro-9694805 (Original)_Trim.mp4";

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

    // Read and display the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileInputLabel = document.querySelector(".file-input-label");
      fileInputLabel.innerHTML = `<img src="${reader.result}" alt="Selected" />`;
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);

      const response = await axios.post(
        "https://image-caption-backend.onrender.com/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Split the string into an array of captions
      const captionsArray = response.data.chatCompletion
        .split("\n")
        .filter(Boolean);
      setCaptions(captionsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCaption = (caption) => {
    navigator.clipboard
      .writeText(caption)
      .then(() => {
        alert("Caption copied to clipboard", caption);
      })
      .catch((error) => {
        console.error("Unable to copy caption to clipboard", error);
      });
  };

  return (
    <div className="outer">
      <video className="background-video" autoPlay loop muted>
        <source src={bgvideo} type="video/mp4" />
      </video>
      <div className="god">
        <h1>Image Caption Generator</h1>
        <label className="file-input-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <span
            className={`file-input-label ${
              selectedFile ? "file-input-label-selected" : ""
            }`}
          >
            {selectedFile ? "Image Selected" : "Give Image"}
          </span>
        </label>
        <button onClick={handleUpload} disabled={loading} className="button-64">
          Generate Captions
        </button>
      </div>
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      {captions.length > 0 && (
        <div className="output">
          {captions.map((caption, index) => (
            <pre>
              <li key={index}>
                {caption}
                <button
                  className="copy-button"
                  onClick={() => handleCopyCaption(caption)}
                  onAnimationEnd={(e) => e.target.classList.remove("clicked")}
                >
                  Copy
                </button>
                <span className="copied-message">Copied!</span>
              </li>
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
