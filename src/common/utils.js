function copyArray(arr) {
  return arr.concat();
}

function range(size) {
  return Array.apply(null, Array(size)).map((_, i) => i);
}

function getSelectorFunction(selector) {
  if (!selector) {
    return item => item;
  } else if (typeof selector === "string") {
    return item => item[selector];
  } else if (typeof selector === "function") {
    return selector;
  } else {
    throw new Error("Invalid selector");
  }
}

// Returns a sorted COPY of an array
function sortBy(selector, arr) {
  const selectorFn = getSelectorFunction(selector);
  return copyArray(arr).sort((a, b) => selectorFn(a) - selectorFn(b));
}

function randomInt(min, max) {
  return min + Math.floor((max - min + 1) * Math.random());
}

function pickRandom(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function sum(selector, arr) {
  const selectorFn = getSelectorFunction(selector);
  return arr.reduce((sum, item) => sum + selectorFn(item), 0);
}

// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(arr) {
  let arrCopy = arr.slice(),
    counter = arrCopy.length,
    temp,
    index;

  // While there are elements in the arrCopy
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = arrCopy[counter];
    arrCopy[counter] = arrCopy[index];
    arrCopy[index] = temp;
  }

  return arrCopy;
}

function chunk(arr, size) {
  var result = [];

  while (arr.length > 0) {
    result.push(arr.splice(0, size));
  }

  return result;
}

function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
}

function pTimeout(time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
}

function dateInSeconds(date) {
  return Math.floor(date / 1000);
}

export default {
  copyArray,
  randomInt,
  pickRandom,
  range,
  sortBy,
  shuffle,
  chunk,
  sum,
  promisify,
  pTimeout,
  dateInSeconds,
};
