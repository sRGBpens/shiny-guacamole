let cols, rows;
let scl = 10;

let colorIs;

//colors
let greyBlush, redBlush, copper, blush, bronze;

function setup() {
  createCanvas(innerWidth, innerHeight);
  cols = (height / scl);
  rows = (width / scl);

  greyBlush = color('#8B818C');
  redBlush = color('#8E6D6B');
  copper = color('#8C6D4C');
  blush = color('#926854');
  bronze = color('#815A2C');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = (height / scl);
  rows = (width / scl);
}

function draw() {
  background(220);
  for (x = 0; x < width; x += rows) {
    for (y = 0; y < height; y += cols) {
      noStroke();

      let colorProb = floor(random(100));
      let colorIs;
      if (colorProb == 0) {
        colorIs = greyBlush;
      }
      else if (colorProb < 10) {
        colorIs = redBlush;
      }
      else if (colorProb < 20) {
        colorIs = copper;
      }
      else if (colorProb < 50) {
        colorIs = blush;
      }
      else if (colorProb < 100) {
        colorIs = bronze;
      }
      fill(colorIs)
      rect(x, y, rows, cols);
      console.log(colorProb);
    }
  }
  noLoop();
}