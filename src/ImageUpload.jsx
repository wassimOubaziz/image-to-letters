// ImageUpload.js
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [transformedText, setTransformedText] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    transformImageToLetters(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const transformImageToLetters = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const { width, height } = img;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let transformedText = "";

        for (let y = 0; y < height; y += 5) {
          for (let x = 0; x < width; x += 2) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3 / 255;

            // Choose a character based on brightness
            const character = brightness > 0.5 ? " " : "@";

            transformedText += character;
          }
          transformedText += "\n";
        }

        setTransformedText(transformedText);
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>Image to Letters</h1>
      <div
        {...getRootProps()}
        style={{
          padding: "20px",
          textAlign: "center",
          border: "1px dashed #ddd",
          borderRadius: "5px",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
      </div>
      {image && (
        <div>
          <h2>Transformed Image</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "black",
            }}
          >
            {transformedText}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
