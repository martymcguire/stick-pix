const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const tracker = new tracking.ObjectTracker('face')
const video = document.getElementById('video');
const flowerCrownButton = document.getElementById('flower-crown')
const bunnyEarsButton = document.getElementById('bunny-ears')
let trackData = [];

const img = new Image()
let filterX = 0
let filterY = 0
let filterWidth = 0
let filterHeight = 0

function changePic (x, y, width, height, src) {
  img.src = src
  filterX = x
  filterY = y
  filterWidth = width
  filterHeight = height
}

function flowerCrown () {
  changePic(0, -0.5, 1, 1, 'flower-crown.png')
}

flowerCrown()

flowerCrownButton.addEventListener('click', flowerCrown)

bunnyEarsButton.addEventListener('click', () => {
  changePic(-0.5, -0.9, 2, 2, 'bunny-ears.png')
})

tracker.setInitialScale(4)
tracker.setStepSize(2)
tracker.setEdgesDensity(0.075)
const activeTracker = tracking.track('#video', tracker, { camera: true })

tracker.on('track', event => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  trackData = event.data;
  drawOverlays(trackData, context, img);
})

function drawOverlays(rects, ctx) {
  rects.forEach(rect =>{
    ctx.drawImage(img, rect.x + (filterX * rect.width),
    rect.y + (filterY * rect.height),
    rect.width * filterWidth,
    rect.height * filterHeight
  )
  });
}

function saveImage() {
  activeTracker.stop();
  const liveControls = document.getElementById('liveControls');
  const saveImg = document.getElementById('saveImage');
  const saveCanvas = document.createElement('canvas');
  const saveCtx = saveCanvas.getContext('2d');
  saveCanvas.width = video.width;
  saveCanvas.height = video.height;
  saveCtx.drawImage(video, 0, 0, saveCanvas.width, saveCanvas.height);
  drawOverlays(trackData, saveCtx);
  saveImg.src = saveCanvas.toDataURL('image/jpeg');
  liveControls.classList.add('hidden');
}

function tryAgain() {
  const liveControls = document.getElementById('liveControls');
  liveControls.classList.remove('hidden');
  activeTracker.run();
}
