// CORE API - tensors, operations
// LAYERS API (keras), higher level
// ml5

// RAKENNA MALLI / BUILD & COMPILE / CONFIGURATE LAYER
// puuttuu input +  train  .fit() + output aka. prediction .predict()

// Layers // neuroverkko
//   inputs - 2
//   hidden - 4 (voi olla useita)
//   output - 3 // => weighted sum of hidden -> classification

// "output is the input for next"  --> HOX aallon kurssi!
// miten voidaan tiputtaa yksi yhteys pois?

// RAUTALANKA TF MALLIN RAKENTAMISESTA - ei dataa
const model = tf.sequential(); // kts. doc tästä (tarvitaan config)

// EKAAN PITÄÄ LAITTAA UNITS = sisään
const configHidden = {
  units: 4,
  inputShape: [2], // datan muoto - layers tietää seuraavan muodon! vain ekaan
  activation: 'sigmoid' // valitaan tarpeen mukaan
}

const configOutput = {
  units: 3,
  activation: 'sigmoid' // valitaan tarpeen mukaan
}

const hidden = tf.layers.dense(configHidden); // layer - dense = fully connectial - kaikki yhdistyy seuraavaan
const output = tf.layers.dense(configOutput);

model.add(hidden); // add layer to model
model.add(output);

// COMPILE
// Optimizer > minimizer > loss()
const sgdOpt = tf.train.sgd(0.1); // kts lineaer regression example - sgd - alkaa jossain vaiheessa adjustaamaan mallia kun treenaa gradien decent
const config = {
  optimizer: sgdOpt,
  loss: tf.losses.meanSquaredError // "meanSquaredError
}
model.compile(config);
