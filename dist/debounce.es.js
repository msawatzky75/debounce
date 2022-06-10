function debounce(func, wait = 100, immediate = false) {
  let timeout = null, args, context, timestamp, result;
  function later() {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }
  const debounced = function(...debouncedargs) {
    context = this;
    args = debouncedargs;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout)
      timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
  debounced.clear = function() {
    if (!timeout)
      return;
    clearTimeout(timeout);
    timeout = null;
  };
  debounced.flush = function() {
    if (!timeout)
      return;
    result = func.apply(context, args);
    context = args = null;
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}
export { debounce, debounce as default };
//# sourceMappingURL=debounce.es.js.map
