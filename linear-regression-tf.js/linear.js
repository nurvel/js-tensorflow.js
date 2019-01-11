// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Linear Regression with TensorFlow.js
// Video: https://www.youtube.com/watch?v=dLp10CFIvxI

let x_vals = [];
let y_vals = [];
/* linear regression, suoran yhtälö y = mx + b
y - tätä ennustetaan - depended variable
m - slope of the line aka. kulmakerroin = kuinka paljon y muuttuu kun x kasvaa yhdellä
c - intercept = vakiotermi aka. kun x=0, y=c
x - input data jolla ennustetaan - tätä muutenaan - independend variable
*/
let m, b; 

const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function setup() {
  createCanvas(400, 400);
  // randomilla alkuarvot - muuten kaatuu
  m = tf.variable(tf.scalar(random(1)));
  b = tf.variable(tf.scalar(random(1)));
}

function loss(pred, labels) {
	// pyrkii etsimään ratkaisun, jossa yhteenlaskettu poikkeama ennusteesta olisi mahd pieni
	
	// loss =(x_ennuste -y)^2
	let loss = pred.sub(labels).square().mean();

	//console.log(loss.print());	
	//console.log(tf.metrics.meanSquaredError(x_vals,pred)); // EI TOIMI -> haluaa tensorin

  return loss;
}

function predict(x) {
  const xs = tf.tensor1d(x);
  // y = mx + b;
  const ys = xs.mul(m).add(b);  
  return ys;
}

// tallennetaan hiiren koordinaatit
function mousePressed() {
  let x = map(mouseX, 0, width, 0, 1);
  let y = map(mouseY, 0, height, 1, 0);
  x_vals.push(x);
  y_vals.push(y);
}

function draw() {

  background(0); // bg valkoinen
  stroke(255); // viiva musta
  strokeWeight(8); // viivan paksuus

  // train the model
  tf.tidy(() => {
    if (x_vals.length > 0) {
      const ys = tf.tensor1d(y_vals); // tensoriksi - datamuutos
      
	  // pyrkii minimoimaan LOSS:in - vähän kuin EXEL-solveri - testailee eri vaihtoehtoja
	  optimizer.minimize(() => loss(predict(x_vals), ys)); // (training data - ennustetut, oikeat vastaukset - alkuperäiset)  -> loss
    }
  });

  // 
  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], 0, 1, 0, width);
    let py = map(y_vals[i], 0, 1, height, 0);
    point(px, py);
  }


  const lineX = [0, 1];

  const ys = tf.tidy(() => predict(lineX));
  let lineY = ys.dataSync();
  ys.dispose();

  let x1 = map(lineX[0], 0, 1, 0, width);
  let x2 = map(lineX[1], 0, 1, 0, width);

  let y1 = map(lineY[0], 0, 1, height, 0);
  let y2 = map(lineY[1], 0, 1, height, 0);

  strokeWeight(2);
  line(x1, y1, x2, y2);


  //console.log(tf.memory().numTensors);
  //noLoop();
}