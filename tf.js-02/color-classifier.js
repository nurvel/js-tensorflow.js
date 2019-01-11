// Daniel Shiffman
// http://codingtra.in

// TensorFlow.js Layers API
// Part 1: https://youtu.be/F4WWukTWoXY
// Part 2: https://youtu.be/iUiOx2fBx18

// This is the model
const model = tf.sequential();

// Create the hidden layer
// dense is a "full connected layer"
const hidden = tf.layers.dense({
  units: 4, // number of nodes
  inputShape: [2], // input shape
  activation: 'sigmoid'
});
// Add the layer
model.add(hidden);

// Creat another layer
const output = tf.layers.dense({
  units: 1,
  // here the input shape is "inferred from the previous layer"
  activation: 'sigmoid'
});
model.add(output);

// An optimizer using gradient descent
const sgdOpt = tf.train.sgd(0.1); // 0.1 = learning rate - kuinka isoja "askeleita"
// optimizer, please "minimize" the "loss function" with "this "lerninf rate"

// I'm done configuring the model so compile it
model.compile({
  optimizer: sgdOpt, // optimizer
  loss: tf.losses.meanSquaredError // loss function. Voi antaa myös metrics
  // minimoidaan virheiden etäisyys ennustuksesta -> virheiden summa pienin mahdollinen
});

// input data - nämä liitetään tulokseen
const xs = tf.tensor2d([
  [0, 0],
  [0.5, 0.5],
  [1, 1]
]);

// input datan tulososuus. 0,0 => 1   0.5, 0.5 => 0.5  1, 1 => 0
const ys = tf.tensor2d([
  [1],
  [0.5],
  [0]
]);


// kutsutaan train funktiota JOKA palauttaa PROMISE. Eli käytetään then(). joka toteuttaa tästä seuraavat hommat
// kts. batch
train().then(() => {
  console.log('training complete');
  let outputs = model.predict(xs); // käytetään mallia - sama data kuin millä trained - ei näin oikeasti :)
  // model.predict(xs).data(); // .dataSync();
  outputs.print();
});

// trainataan model - asyncissa jotta voidaan tehdä muutakin samalla + laittaa looppiin. Se on ainoa syy.
async function train() {
  // trainaa x kertaa
  // POINTTI: traini adjustaa eri neuronien välistä painoa  - vaihtelee kunnes pääsee odotettuun tulokseen parhaalla mahdollisella tavalla
  for (let i = 0; i < 100; i++) {
    const config = {
      shuffle: true, // training data suffle epoc välillä
      epochs: 10 // 10 X PER FITTING
    }
    const response = await model.fit(xs, ys, config); // trainataan data
    console.log(response.history.loss[0]); // tulostetaan loss functio tulos - tämä pienenee koodissa
  }
}

// tf.tidy(){} // alla olevan voisi laittaa ja siivoasisi välimuistin


// const xs = tf.tensor2d([
//   [0.25, 0.92],
//   [0.12, 0.3],
//   [0.4, 0.74],
//   [0.1, 0.22],
// ]);
// let ys = model.predict(xs);
// outputs.print();
