// luo DataView()
const values = [];
for(let i = 0; i < 30; i++) {
  values[i] = Math.floor(Math.random() * Math.floor(100));
}

const shape= [2,5,3]; // size, height, width
const tense = tf.tensor3d(values, shape, 'int32'); // tensor - immutable

tense.print();
console.log(tense.dataSync()); // palauttaa ilman promise
console.log(tense);

// palauttaa promise kts. promise + then // sync and async HOX
tense.data().then(function(stuff){
  console.log(stuff);
})
// tense.get(0); // indeksi

// tensorista VARIABLE
// muistinhallinan vuoksi - jos data muuttuu/ei muuttuu - TRAINABLE!
const vtense = tf.variable(tense); // variable voi muuttua
console.log(vtense);

// mathematical OPERATIONS - chekkaa lisää tutoriala
// lineaer algebra: https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab

// a.add(b); // lisää yhteen
// matMul matrix Multimicational => a rivit = b sarakkeet
// const = b.transpose(); // muista immutable

//-- MEMORY MANAGEMENT
console.log(tf.memory().numTensors);
// a.dispose(); // poistaa muistista
// tf.tidy(myStuff); // wrapper <- kirjoitetaan functio! muStuff() {}..
// tf.tify/(() => {}))
