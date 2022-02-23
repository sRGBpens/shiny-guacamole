let button;
let snapShots = [];
let counter = 0;
let sOff = 0.0;
let xOff = 0.0;
let yOff = 0.0;
let snapScale;
let totalSnaps;

let lastCheckin;
let lastSnap;

let drawDelay;
let snapDelay;

let img = [];

let i;

function preload() {
    for (let i = 0; i < 50; i++) {
    img[i] = loadImage("img/dog-" + i + ".jpg");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);
  imageMode(CENTER);
  lastCheckin = millis();
  lastSnap = millis();
  totalSnaps = 8;
  snapScale = 16;
  drawDelay = 1000;
  snapDelay = 1;
  noSmooth();
}

function draw() {
  if (millis() - lastCheckin > drawDelay) {
    background(255);
    drawSnaps();
    lastCheckin = millis();
  }
  if (millis() - lastSnap > snapDelay) {
    getSnaps();
    lastSnap = millis();
  }
  console.log(img);
  }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function getSnaps() {
  snapShots = img;

}

function drawSnaps() {
  let h = height/snapScale;
  let w = h/3*4;
  let x = 0;
  let y = 0
  for (let i = 0; i < snapShots.length; i++) {
    sOff = sOff + 0.1;
    xOff = xOff + 0.5;
    yOff = yOff + 1
    let index = (i + frameCount) % snapShots.length;
    let vScale = map(noise(sOff),0,1,0,h/snapScale);
    let xWalk = map(noise(xOff),0,1,w*.5,innerWidth-w*.5);
    let yWalk = map(noise(yOff),0,1,h*.5,innerHeight-h*.5);
    image(snapShots[index], xWalk, yWalk, w*vScale, h*vScale);
  }
}

function keyPressed() {
//   if (keyCode == DOWN_ARROW) {
//     // if (keyCode == DOWN_ARROW && snapShots.lengh > 8) {
//   let removedSnaps = snapShots.splice(snapShots.lengh,8);
//   totalSnaps = snapShots.lengh;
//     // let removedSnaps = snapShots.splice(snapShots.lengh,snapShots.lengh/2);
// }
// if (keyCode == UP_ARROW) {
//   // if (keyCode == UP_ARROW && snapShots.length) <=1024) {
//   for (let i = 0; i < 8; i++) {
//     // for (let i = 0; i < snapShots.lengh/2; i++) {
//   let newLengh = snapShots.push(video.get()); 
//   totalSnaps = snapShots.lengh; 
// }
// }
if (keyCode == DOWN_ARROW) {
  drawDelay = drawDelay/2;
}
if (keyCode == UP_ARROW) {
  drawDelay = drawDelay*2;
}
if (keyCode == LEFT_ARROW) {
  snapScale--;
}
if (keyCode == RIGHT_ARROW) {
  snapScale++;
}
console.log('Total Snapshots:',snapShots.length,'Snap Scale:',snapScale, 'Counter:', counter, drawDelay);
}
