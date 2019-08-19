// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {

  var identifyString = function (first, last) {
    return function (str) {
      return first === str[0] && last === str[str.length - 1];
    };
  };

  var isArray = identifyString('[', ']');
  var isObject = identifyString('{', '}');
  var isSingle = identifyString("'", "'");
  var isDouble = identifyString('"', '"');

  var isNumber = function (str) {
    return + str + '' === str
  }

  var isString = function (str) {
    str = str.trim();
    return (isDouble(str) || isSingle(str)) && str[str.length - 2] !== '\\'
  };

  var quotes = function (str) {
    str = str.trim()
    // if (input[0] === '\"' && input[input.length - 1] === '\"') {
    return str.substring(1).slice(0, str.length - 2) || ''
  }

  var splitString = function (inputChar) {
    return function (str) {
      var outputArr = [];
      var arrayString = '';
      var lastCharacter = '';
      var insideArr = false;
      var insideObj = false;
      var arrBox = 0;
      var objBox = 0;
      var inDoubleQuotes = false;
      var inSingleQuotes = false;
      for (var i = 0; i < str.length; i++) {
        var characterCheck = str[i];

        if (characterCheck === '"') {
          inDoubleQuotes = !inDoubleQuotes;
        }
        if (characterCheck === "'") {
          inSingleQuotes = !inSingleQuotes;
        }
        if (characterCheck === '[') {
          insideArr = true;
          ++arrBox;
        }
        if (characterCheck === ']') {
          --arrBox;
          if (arrBox === 0) {
            insideArr = false;
          }
        }
        if (characterCheck === '{') {
          insideObj = true;
          ++objBox;
        }
        if (characterCheck === '}') {
          --objBox;
          if (objBox === 0) {
            insideObj = false;
          }
        }

        if ((characterCheck === inputChar)
          && (insideArr === false)
          && (insideObj === false)
          && (inDoubleQuotes === false) && (inSingleQuotes === false)) {
          if (arrayString.length > 0) {
            outputArr.push(arrayString.trim())
          arrayString = '';
          lastCharacter = '';
          }
        } else {
          arrayString += characterCheck;
          lastCharacter = characterCheck;
        }
      }
      if (arrayString.length > 0){
        outputArr.push(arrayString.trim());
      }
      console.log(outputArr)
      return outputArr;
    }
  }

  var findCommas = splitString(',');
  var findColons = splitString(':');

  var decipherType = function (str, parent) {
    str = str.trim();

    if (isArray(str)) {
      return findCommas(quotes(str)).map(decipherType)
    }

    if (isObject(str)) {
      var formatted = {}
      var arrayObj = findCommas(quotes(str))
      arrayObj.forEach(function (key, index) {
        var organizeObj = findColons(key)
        if (organizeObj.length === 2) {
          formatted[decipherType(organizeObj[0])] = decipherType(organizeObj[1])
        }
      })
      console.log(formatted)
      return formatted;
    }

    if (isString(str)) {
      return quotes(str).replace(/([\\]{1})([\\\"]{1})/g, '$2');
    }

    if (str === 'null') {
      return null;
    }
    if (str === 'true') {
      return true;
    }
    if (str === 'false') {
      return false;
    }
    if (str === 'undefined') {
      return undefined;
    }
    if (isNumber(str)){
      return +str
    } 
    // if (str === Number(json)) {
    //   return Number(json);
    // }
    throw SyntaxError('invalid stringified JSON')
  }
  return decipherType(json)
}

