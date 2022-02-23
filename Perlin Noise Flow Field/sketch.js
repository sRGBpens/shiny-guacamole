let inc = .1;
let scl = 40;
let cols, rows;

let fr;

let zOff = 0;

let particles = [];

let flowField;

function setup() {
  createCanvas(innerWidth, innerHeight);
  cols = floor(width/scl);
  rows = floor(height/scl);
  colorMode(HSB, 360, 100, 100, 1);

  flowField = new Array(cols*rows);

  for (let i =0; i < 1000*100; i++) {
  particles[i] = new Particle();
  }
}

function draw() {
  let yOff = 0;
  for(let y = 0; y < rows; y++){
    let xOff = 0;
    for(let x = 0; x <cols; x++){
      let index = x + y * cols;
      let angle = noise(xOff, yOff, zOff) * TWO_PI * TWO_PI;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xOff += inc;
      stroke(0, 100,100,.5);
      strokeWeight(1);
      // push();
      // translate(x * scl, y * scl);
      // rotate(v.heading());
      // line(0,0,scl,0);
      // pop();
  }
  yOff += inc;
  zOff+=.0001;
}
for (let i = 0; i < particles.length; i++){
particles[i].follow(flowField);
particles[i].update();
particles[i].edges();
particles[i].show();
}
} 