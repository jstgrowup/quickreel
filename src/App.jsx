import { useRef, useEffect, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";
import { fabric } from "fabric";
function App() {
  const videoRef = useRef();
  const inputRef = useRef();
  const canvasRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(detectFaces);
  };
  const handleFileChange = () => {
    const file = inputRef.current.files[0];
    if (file) {
      const videoBlob = URL.createObjectURL(file);
      videoRef.current.src = videoBlob;
      videoRef.current.play();
      detectFaces();
    }
  };

  const detectFaces = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const canvas = canvasRef.current;
      faceapi.matchDimensions(canvas, {
        width: 940,
        height: 650,
      });
      const resizedDetections = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      const fabriccanvas = new fabric.Canvas(canvasRef.current);
      resizedDetections.map((ele) => {
        let tempRect = new fabric.Rect({
          width: ele.alignedRect._box._width,
          height: ele.alignedRect._box._height,
          left: ele.alignedRect._box._x,
          top: ele.alignedRect._box._y,
          fill: "transparent",
          strokeWidth: 5,
          stroke: "blue",
        });
        fabriccanvas.add(tempRect);
      });
    }, 1000);
  };
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <div className="myapp">
        <video
          ref={videoRef}
          crossOrigin="anonymous"
          autoPlay
          controls
          id="video"
        />
        <canvas ref={canvasRef} width="10" height="200" id="overlay" />
      </div>
      <div id="btn">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={inputRef}
          id="videoInput"
        />
        <button id="playPauseButton" onClick={togglePlayPause}>
          Play / Pause
        </button>
      </div>
    </>
  );
}

export default App;
