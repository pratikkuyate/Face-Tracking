//access webcam
const video = document.getElementById('video')
// run all async calls in parallel for faster execution
Promise.all
([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), //load all the models form API
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)
//connect video element to webcam
function startVideo()
{
  navigator.getUserMedia(
    {video : {}},   // video is key and {} is parameter
    stream => video.srcObject = stream, // stream is object and video is source
    err => console.error(err)  // log the error if any occur during execution
  )
}
// set event listener
video.addEventListener('play', ()=> {
  //console.log('working')
  const canvas = faceapi.createCanvasFromMedia(video) //show the mapping on the face
  document.body.append(canvas) //show the mapping on the screen
  const displaySize = { width: video.width, height: video.height } // get the size of video screen
  faceapi.matchDimensions(canvas, displaySize) //match the canvas to display size
  //run the code multile time async 
  setInterval(async () => {
    //run the code every 100 ms 
    //FaceDetector is use to detect face
    //withFaceLandmarks is used to show different sections on face
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    .withFaceExpressions()
    console.log(detections)
    if(detections.length==0)      //if face is not detected then it will show warning
    {
      console.log("no face detected")
      alert("Face not detected");
    }
    if(detections.length>=2)
    {
      alert("More than one person is in the frame");
    }
    const resizedDetections = faceapi.resizeResults(detections, displaySize) //show detections on canvas
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) //clear the canvas
    faceapi.draw.drawDetections(canvas, resizedDetections)
  },5000)

})
