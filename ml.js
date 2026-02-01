let model;

async function loadModel(){
    await tf.setBackend('cpu');  // Force CPU backend
    console.log("Backend:", tf.getBackend());

    model = tf.sequential();
    model.add(tf.layers.dense({units:8, inputShape:[4], activation:'relu'}));
    model.add(tf.layers.dense({units:1, activation:'sigmoid'}));
    model.compile({optimizer:'adam', loss:'binaryCrossentropy'});

    const xs = tf.tensor2d([
        [2,2,2,8],
        [0,0,0,11],
        [1,1,1,9],
        [2,1,2,7],
        [0,0,1,12],
    ]);
    const ys = tf.tensor2d([[1],[0],[1],[1],[0]]);
    await model.fit(xs,ys,{epochs:100});
}

loadModel();

async function predictEnergy(food, activity, water, wakeHour){
  let input = tf.tensor2d([[food, activity, water, wakeHour]]);
  let output = model.predict(input);
  let value = await output.data();
  return value[0];
}
