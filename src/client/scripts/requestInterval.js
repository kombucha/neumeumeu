// Lifted from https://gist.github.com/joelambert/1002116

/**
 * Behaves the same as setInterval except uses requestAnimationFrame()
 * where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
function requestInterval(fn, delay) {
  if (!requestAnimationFrame) {
    return setInterval(fn, delay);
  }

  var start = new Date().getTime();
  var handle = {};

  function loop() {
    var current = new Date().getTime();
    var delta = current - start;

    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }

    if (!handle.cancelled) {
      handle.value = requestAnimationFrame(loop);
    }
  }

  handle.value = requestAnimationFrame(loop);
  return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * where possible for better performance
 * @param {int|object} fn The callback function
 */
function clearRequestInterval(handle) {
  if (cancelAnimationFrame && handle) {
    handle.cancelled = true;
    return cancelAnimationFrame(handle.value);
  }

  return clearInterval(handle);
}

export default {
  requestInterval,
  clearRequestInterval,
};
