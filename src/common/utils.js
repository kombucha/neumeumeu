function range(size) {
    return Array.apply(null, Array(size)).map((_, i) => i);
}

// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(arr) {
    let arrCopy = arr.slice(),
        counter = arrCopy.length, temp, index;

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
    return (...args) => new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });
}

export default {
    range,
    shuffle,
    chunk,
    promisify
};
