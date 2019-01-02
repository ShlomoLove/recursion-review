// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  let output = [];
  const findElements = function (element) {
    if (element.classList && element.classList.contains(className)) {
      output.push(element);
    }
    if (element.childNodes.length > 0) {
      for (let i = 0; i < element.childNodes.length; i++) {
        findElements(element.childNodes[i])
      }
    }
  }
  findElements(document.body);
  return output; 
};
