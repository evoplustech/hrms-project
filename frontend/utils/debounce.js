export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    console.log('debounced timeemememememe',timeoutId);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};