const video = document.getElementById("video");
const videoInput = document.getElementById("videoInput");
const overlay = document.getElementById("overlay");
const playPauseButton = document.getElementById("playPauseButton");

videoInput.addEventListener("change", handleFileInputChange);
playPauseButton.addEventListener("click", togglePlayPause);
async function handleFileInputChange(event) {
  const file = event.target.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    video.src = videoURL;
    await startVideo();
  }
}
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

async function startVideo() {
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(overlay, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    overlay.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);
    faceapi.draw.drawDetections(overlay, resizedDetections);
    faceapi.draw.drawFaceLandmarks(overlay, resizedDetections);
    faceapi.draw.drawFaceExpressions(overlay, resizedDetections);
  }, 100);
}

function togglePlayPause() {
  if (video.paused) {
    video.play();
 
  } else {
    video.pause();
  
  }
}
