import { useRef, useEffect, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";
import { fabric } from "fabric";
function App() {
  const videoRef = useRef();
  const inputRef = useRef();
  const canvasRef = useRef();
  const fabricCanvas = new fabric.Canvas();
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(loadCanvas);
  };
  const handleFileChange = () => {
    const file = inputRef.current.files[0];
    if (file) {
      const videoBlob = URL.createObjectURL(file);
      videoRef.current.src = videoBlob;
      videoRef.current.play();
      loadCanvas();
    }
  };
  const loadCanvas = () => {
    var canvas = new fabric.Canvas(canvasRef.current);
    var video1 = new fabric.Rect({
      fill: "transparent",
      width: 400,
      height: 400,
      strokeWidth: 2,
      stroke: "green",
    });
    canvas.add(video1);
    video1.getElement().play();
  };

  // const detectFaces = async () => {
  //   setInterval(async () => {
  //     const detections = await faceapi
  //       .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
  //       .withFaceLandmarks();
  //     faceapi.matchDimensions(canvas, {
  //       width: 940,
  //       height: 650,
  //     });
  //     const resizedDetections = faceapi.resizeResults(detections, {
  //       width: 940,
  //       height: 650,
  //     });
  //     const canvas = canvasRef.current;
  //     const fabriccanvas = new fabric.Canvas("overlay");
  //     let tempRect = new fabric.Rect({
  //       width: 200,
  //       height: 100,
  //       left: 100,
  //       top: 75,
  //       fill: "orange",
  //     });
  //     fabriccanvas.add(tempRect);
  //   }, 100);
  // };
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
        <canvas ref={canvasRef} width="1400" height="600" id="overlay"></canvas>
        <video ref={videoRef} autoPlay controls id="video" />
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
