// Based on sketch “Cyberpunk Flow Field Lines” by antoro.
// https://openprocessing.org/sketch/1126556 

let data;

// Parameters
let noiseScale;
let amountSmall;
let amountMed;
let amountLarge;
let gridSize;
let minLength;

let catColor;

let numberItems

// Colors
let colorPalette = ["#8B818C", "#8E6D6B", "#8C6D4C", "#926854", "#815A2C"];
let bg = [192, 192, 192];

// Global variables
let curves = [];

function preload() {
  // data = loadTable('assets/amazon.csv', 'csv', 'header');
  data = loadTable('assets/2021.csv', 'csv', 'header');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(RGB);

  noStroke();
  noLoop();

  noiseScale = 0.001;
  amountSmall = 0;
  amountMed = 0;
  amountLarge = 0;
  //get the number of rows in the CSV
  numberItems = data.getRowCount();
  gridSize = 5;
  minLength = 400;
  // minLength = data.getColumn("Item Subtotal");

  generate();
}

function generate() {
  curves.length = 0;
  background(bg[0], bg[1], bg[2]);
  spawn(amountSmall, amountMed, amountLarge, numberItems);
  // loop through all paths in curves
  if (curves.length !== 0) {
    for (let i = 0; i < curves.length; i++) {
      drawPath(i);
    }
  }
  redraw();
}

function spawn(s, m, l, n) {
  // thick paths
  for (let i = 0; i < l; i++) {
    addPath(45, 85, 0.002);
  }
  loadPixels();
  // medium thickness paths
  for (let i = 0; i < m; i++) {
    addPath(20, 45, 0.006);
  }
  loadPixels();
  // thin paths
  for (let i = 0; i < s; i++) {
    addPath(3, 10, 0.05);
  }
  // Number of Items
  for (let i = 0; i < n; i++) {
    // addPath(45, 85, 0.05);
    let Amount = data.getColumn('Amount');
    let tThick = map(Amount[i], 1.25, 3508, 1.25, 3508);
    let Category = data.getColumn('Category');
    let cat = Category[i];
    console.log(cat);
    if (cat == 'Shopping') {
      catColor = colorPalette[0];
    }
    else if (cat == 'Groceries') {
      catColor = colorPalette[1];
    }
    else if (cat == 'Home') {
      catColor = colorPalette[2];
    }
    else if (cat == 'Travel') {
      catColor = colorPalette[3];
    }
    else {
      catColor = colorPalette[4];
    }
    addPath(tThick, tThick, catColor);
    console.log(Amount);
  }
  loadPixels();
}

function addPath(tmin, tmax, prob) {
  let p = new Path(tmin, tmax, prob);
  if (p.validPos()) {
    curves.push(p);
  }
}

class Path {
  constructor(thickmin, thickmax, catColor) {
    this.x = random(width);
    this.y = random(height);
    this.firstPositions = [];
    this.len = 0;
    this.maxlen = minLength;
    this.thickness = random(thickmin, thickmax);
    this.c = catColor;
    // this.c = colorPalette[floor(random(colorPalette.length))];
    // this.randColChance = randColChance;
  }

  // randomColor() {
  //   // change color in line
  //   if (random(1.0) < this.randColChance) {
  //     this.c = colorPalette[floor(random(colorPalette.length))];
  //   }
  // }

  validPos() {
    let xy = get(this.x, this.y);
    return (xy[0] == bg[0] && xy[1] == bg[1] && xy[2] == bg[2] ? true : false);
  }

  validPosAlpha() {
    // check background alpha [3]
    return (get(this.x, this.y)[3] == 0 ? true : false);
  }
}

function draw_old() {
  // loop through all paths in curves
  if (curves.length !== 0) {
    for (let i = 0; i < curves.length; i++) {
      drawPath(i);
    }
  }
}

// edit this to make a min length
function drawPath(i) {
  if (frameCount % 10 == 0) { loadPixels(); }
  // loadPixels(); // put this here to call it as little as possible
  let firstPoints = [];
  let failed = false;
  for (let a = 0; a < minLength; a++) {
    // calculate new spot
    curves[i].len += 1;
    let angle = noise(curves[i].x * noiseScale, curves[i].y * noiseScale) * TWO_PI;
    curves[i].x += cos(angle);
    curves[i].y += sin(angle);

    // check area around it
    let spaceFree = checkCornersHue(curves[i].x, curves[i].y, curves[i].thickness, 6, angle, curves[i].len == 1);
    if (!spaceFree) {
      failed = true;
      curves.splice(i, 1);
      break;
    } else {
      // these return [rx1, ry1, rx2, ry2];
      let ptsArr = [];
      let pts1 = getRectPoints(curves[i].x, curves[i].y, curves[i].thickness, 2, angle);
      let pts2 = getRectPoints(curves[i].x, curves[i].y, curves[i].thickness, -2, angle);
      ptsArr.push(pts1);
      ptsArr.push(pts2);
      firstPoints.push(ptsArr);
    }
  }
  // console.log(firstPoints);
  if (failed !== true) {
    for (let a = 0; a < firstPoints.length; a++) {
      fill(curves[i].c);
      quad(firstPoints[a][0][0], firstPoints[a][0][1], firstPoints[a][0][2], firstPoints[a][0][3], firstPoints[a][1][2], firstPoints[a][1][3], firstPoints[a][1][0], firstPoints[a][1][1]);
    }
    while (curves[i].len < curves[i].maxlen && !failed) {
      // calculate new spot
      curves[i].len += 1;
      let angle = noise(curves[i].x * noiseScale, curves[i].y * noiseScale) * TWO_PI;
      curves[i].x += cos(angle);
      curves[i].y += sin(angle);

      // check area around it
      let spaceFree = checkCornersHue(curves[i].x, curves[i].y, curves[i].thickness, 6, angle, curves[i].len == 1);
      // draw or remove from curves
      if (curves[i].len < curves[i].maxlen && spaceFree) {
        let pts1 = getRectPoints(curves[i].x, curves[i].y, curves[i].thickness, 2, angle);
        let pts2 = getRectPoints(curves[i].x, curves[i].y, curves[i].thickness, -2, angle);
        curves[i];
        // curves[i].randomColor();
        fill(curves[i].c);
        quad(pts1[0], pts1[1], pts1[2], pts1[3], pts2[2], pts2[3], pts2[0], pts2[1]);
      } else { // stop and delete if no space free or length reached
        curves.splice(i, 1);
        break;
      }
      // delete out of bounds
      if (curves[i].x > width || curves[i].x < 0 || curves[i].y > height || curves[i].y < 0) {
        curves.splice(i, 1);
        break;
      }
    }
  }
}

function checkCornersHue(x, y, w, h, theta, first) {
  // h should be 6
  let checks = [];
  // check at 1.05 * width and 6 height for occupancy
  let cornerpts = getRectPoints(x, y, w * 1.05, h, theta);
  // check at width / 3 and 6 height for occupancy
  let midpts = getRectPoints(x, y, w / 3, h, theta);
  // get(x, y)[3] returns alpha value of pixel
  let emptyFront = (get(cornerpts[0], cornerpts[1])[0] == bg[0] && get(cornerpts[2], cornerpts[3])[0] == bg[0]
    && get(midpts[0], midpts[1])[0] == bg[0] && get(midpts[2], midpts[3])[0] == bg[0] ? true : false);
  checks.push(emptyFront);
  // console.log(emptyFront);
  if (first) { // check rear if this is the first rectangle of a path
    let cornerptsback = getRectPoints(x, y, w * 1.05, -h, theta);
    let midptsback = getRectPoints(x, y, w / 3, -h, theta);
    let emptyBack = (get(cornerptsback[0], cornerptsback[1])[0] == bg[0] && get(cornerptsback[2], cornerptsback[3])[0] == bg[0]
      && get(midptsback[0], midptsback[1])[0] == bg[0] && get(midptsback[2], midptsback[3])[0] == bg[0] ? true : false);
    checks.push(emptyBack);
  }
  let checker = arr => arr.every(Boolean); // nifty way to check if array is all true
  return checker(checks);
}

function getRectPoints(cx, cy, w, h, theta) {
  // turns center pt, width, height and angle to both "top" pts coords
  theta -= PI / 2 // correct for 90 degree turn of rectangle
  let x1 = w / 2;
  let y1 = h / 2;
  let x2 = -w / 2;
  let y2 = h / 2;
  let rx1 = cx + (x1 * cos(theta)) - (y1 * sin(theta));
  let ry1 = cy + (x1 * sin(theta)) + (y1 * cos(theta));
  let rx2 = cx + (x2 * cos(theta)) - (y2 * sin(theta));
  let ry2 = cy + (x2 * sin(theta)) + (y2 * cos(theta));
  return [rx1, ry1, rx2, ry2];
}