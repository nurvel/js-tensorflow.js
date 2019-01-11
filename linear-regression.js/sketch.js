/* linear regression, suoran yhtälö y = mx + b
y - tätä ennustetaan - depended variable
m - slope of the line aka. kulmakerroin = kuinka paljon y muuttuu kun x kasvaa yhdellä
c - intercept = vakiotermi aka. kun x=0, y=c
x - input data jolla ennustetaan - tätä muutenaan - independend variable
*/

// https://www.youtube.com/watch?v=zPG4NjIkCjc&index=1&list=PLF596A4043DBEAE9C
// https://opetus.tv/maa/maa1/neliojuuri/
let x_vals = []; // [100,200,300,400,500];
let y_vals = []; // [200,400,500,400,500];

let x_mean;
let y_mean;
let slope;
let intercept;

let r2; // actual vs mean - 0-1
let y_predicts = [];
let strndrdError; // actuals vs. estimated - 0 = perfect match

function setup() {
  createCanvas(600, 600);

  for(let i = 0 ; i < 5 ; i++) {
    x_vals.push(floor(random(height)));
    y_vals.push(floor(random(width)));
  }

  // mean - if needed to plot centre
  // let xm = map(x_mean, 0, height, 0, 100);
  // let ym = map(y_mean, 0, width, 0, 100);
  // ellipse(xm, ym, 10);

  // if needed to present values betwen 0-100
  // let yi = map(intercept, 0, width, 0, 100);
  // let y_max = map(y_pred, 0, width, 0, 100);
  // let x_max = map(height, 0, height, 0, 100);
  // console.log(y_max);
  // console.log(x_max);
}

function predict(x){
  // y = xm + c
  return x * slope + intercept;
}

function calc_slope () {
  let dem = 0;
  let num = 0;
  for (let i = 0; i < x_vals.length; i++){
    let xm = x_vals[i] - x_mean;
    let ym = y_vals[i] - y_mean;
    dem += sq(xm);
    num +=  xm * ym;
  }
  return num/dem;
}

function rSquared () {
  let umSquared = 0;
  let yPredicted = 0;
  for (let i = 0; i < y_vals.length; i++){
    let ym = y_vals[i] - y_mean; // shoud equal to 0
    umSquared += sq(ym);
    yPredicted += sq(y_predicts[i] - y_mean);
    y_predicts.push(y_predicts[i]); // for visualisation
  }
  r2 = yPredicted/umSquared;
  return r2;
}

function standardErroOfEstimate () {
  let n = 0;
  for (let i = 0; i < y_vals.length; i++){
    let yp = y_predicts[i];
    n += (sq(yp - y_vals[i]));
  }
  strndrdError = sqrt(n/(y_vals.length-2));
  return strndrdError;
}

function mean(vals){
  let sum = 0;
  for(let i = 0; i < vals.length; i++) {
    sum += vals[i];
  }
  return  (sum/vals.length);
}

function mousePressed() {
  x_vals.push(mouseX);
  y_vals.push(mouseY);
}

function drawStatics(){
  stroke(0);
  textSize(20);
  fill(100);
  text('intercept: ' + intercept, 10, 30);
  text('slope: ' + slope , 10, 60);
  text('r2: ' + r2 , 10, 90);
  fill(150, 0, 0);
  text('stdrEr: ' + strndrdError , 10, 120);
}

function updateModel(){

}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(2);

  // update model
  x_mean = mean(x_vals);
  y_mean = mean(y_vals);
  slope = calc_slope();
  intercept = y_mean - slope * x_mean;

  // update predicts array
  for (let i = 0; i < x_vals.length ; i++){
    y_predicts.push(predict(x_vals[i]));
  }

  rSquared ();
  standardErroOfEstimate();
  drawStatics();

  // draw stuff
  let y_pred = predict(width); // max_y for trendline
  stroke(255, 255, 255);
  line(width, y_pred, 0, intercept); // trendline
  line(width, y_mean, 0, y_mean); // y mean

  //draw em balls
  for (let i = 0 ; i < x_vals.length ; i++){
    let x = x_vals[i];
    let y = y_vals[i];
    let yp = y_predicts[i];

    fill(150, 0, 0);
    stroke(150, 0, 0);
    line(x, yp, x, y); // pred to act
    ellipse(x, yp, 10); // predictions
    //line(x + 5, y, x +5, y_mean); // pred to y mean

    fill(255, 255, 255);
    ellipse(x, y, 10); // actuals
  }

  // noLoop();
}
