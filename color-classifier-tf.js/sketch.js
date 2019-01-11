// Daniel Shiffman
// Intelligence and Learning
// The Coding Train

// Full tutorial playlist:
// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bmMRCIoTi72aNWHo7epX4L

// Code from end of 7.12
// https://youtu.be/lz2L-sT8bG0

// Community version:
// https://codingtrain.github.io/ColorClassifer-TensorFlow.js
// https://github.com/CodingTrain/ColorClassifer-TensorFlow.js

let data;
let model;
let xs, ys;
let rSlider, gSlider, bSlider;
let labelP;
let lossP;

let labelList = [
  'red-ish',
  'green-ish',
  'blue-ish',
  'orange-ish',
  'yellow-ish',
  'pink-ish',
  'purple-ish',
  'brown-ish',
  'grey-ish'
]

function preload() {
  data = loadJSON('./colorData.json');
}

function setup() {
  // Crude interface
  labelP = createP('label');
  lossP = createP('loss');
  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 255);

  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    let col = [record.r / 255, record.g / 255, record.b / 255]; // datan normalisointi, eli 0-1 arvoiksi muuttaminen
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }

// HOX datan sekoitus voisi olla hyvä
  xs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, 'int32'); // tensorit - datarivit

  ys = tf.oneHot(labelsTensor, 9).cast('float32'); // indexit - datariveistä
  labelsTensor.dispose(); // völimuisti

  model = tf.sequential(); // asetus - vaiheet
  // vaihe1 (kts dokumentaatio eri vaihtoehdot)
  const hidden = tf.layers.dense({
    units: 16,
    inputShape: [3],
    activation: 'sigmoid' // on vaihtoehtoja
  });
  //vaihe2
  const output = tf.layers.dense({
    units: 9,
    activation: 'softmax' // on vaihtoehtoja
  });
  model.add(hidden);
  model.add(output);

  const LEARNING_RATE = 0.25;
  const optimizer = tf.train.sgd(LEARNING_RATE); //sgd - tähän on vahtoehtoja

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy', // vaihtoehtoja
    metrics: ['accuracy'], //??
  });

  train();
}

// async jotta voidaan prosessoida grafiikkaa samalla
async function train() {
  // This is leaking https://github.com/tensorflow/tfjs/issues/457
  await model.fit(xs, ys, {
    shuffle: true,
    validationSplit: 0.1, // 10 % datasta
    epochs: 100, // 100 kertaa iteroidaan
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(epoch);
        lossP.html('loss: ' + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        console.log('finished')
      },
    },
  });
}

function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);
  strokeWeight(2);
  stroke(255);
  line(frameCount % width, 0, frameCount % width, height);
  tf.tidy(() => {
    const input = tf.tensor2d([
      [r, g, b]
    ]);
	
    let results = model.predict(input); // käytetään mallia
	
    let argMax = results.argMax(1); // hakee 9 arrayn vaihtoehdosta suurimman aka. todennäköisimmän
    let index = argMax.dataSync()[0]; // datan formaatti muutetaan int iksi arraysta
    let label = labelList[index]; // haetaan nimi värille indeksin mukaisesti
    labelP.html(label); // päivitetään html
  });
}
