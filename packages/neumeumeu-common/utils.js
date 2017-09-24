function copyArray(arr) {
  return arr.concat();
}

function range(size) {
  return Array.apply(null, Array(size)).map(function(_, i) {
    return i;
  });
}

function getSelectorFunction(selector) {
  if (!selector) {
    return function(item) {
      return item;
    };
  } else if (typeof selector === "string") {
    return function(item) {
      return item[selector];
    };
  } else if (typeof selector === "function") {
    return selector;
  } else {
    throw new Error("Invalid selector");
  }
}

// Returns a sorted COPY of an array
function sortBy(selector, arr) {
  var selectorFn = getSelectorFunction(selector);
  return copyArray(arr).sort(function(a, b) {
    return selectorFn(a) - selectorFn(b);
  });
}

function randomInt(min, max) {
  return min + Math.floor((max - min + 1) * Math.random());
}

function pickRandom(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function sum(selector, arr) {
  var selectorFn = getSelectorFunction(selector);
  return arr.reduce(function(sum, item) {
    return sum + selectorFn(item);
  }, 0);
}

// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(arr) {
  var arrCopy = arr.slice();
  var counter = arrCopy.length;
  var temp;
  var index;

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

function promisify(fn, context) {
  return function() {
    var args = [].slice.call(arguments);
    return new Promise(function(resolve, reject) {
      fn.apply(
        context,
        args.concat(function(err, value) {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        })
      );
    });
  };
}

function dateInSeconds(date) {
  return Math.floor(date / 1000);
}

module.exports = {
  copyArray: copyArray,
  randomInt: randomInt,
  pickRandom: pickRandom,
  range: range,
  sortBy: sortBy,
  shuffle: shuffle,
  chunk: chunk,
  sum: sum,
  promisify: promisify,
  dateInSeconds: dateInSeconds,
};
