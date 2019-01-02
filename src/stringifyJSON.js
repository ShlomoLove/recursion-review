// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  // check data type
  // check if Array or not
  let arr = [];
  var str = '';
  if (obj === null || obj === NaN || obj === Infinity) {
    return 'null';
  } else if (typeof obj === 'number' || typeof obj === 'boolean') {
    return '' + obj; 
  } else if (typeof obj === 'string') {
    return '"' + obj + '"'; 
  }
  if (typeof obj === 'object') {
    if (Array.isArray(obj) && obj.length > 0) {
      for (var i = 0; i < obj.length; i++) {
        arr.push(stringifyJSON(obj[i]));
      }
      console.log(arr, 'arr', obj, 'obj');
      return '[' + arr + ']';
    } else if (Array.isArray(obj) && obj.length < 1) {
      return '[' + obj + ']';
    }
    if (Object.keys(obj).length < 1) {
      return '{}'
    } else {
      for (var key in obj) {
        if (typeof obj[key] !== 'function' && obj[key] !== undefined) {
          arr.push( stringifyJSON(key) + ":" + stringifyJSON(obj[key]))
        }
      }
    }
    return '{' + arr + '}';
  }
};
