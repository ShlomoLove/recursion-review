// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
const parseJSON = (json) => {

  const identifyString = (first, last) => {
    return function (str) {
      return first === str[0] && last === str[str.length - 1];
    };
  };

  let isArray = identifyString('[', ']');
  let isObject = identifyString('{', '}');
  let isSingle = identifyString("'", "'");
  let isDouble = identifyString('"', '"');

  const isNumber = (str) => {
    return + str + '' === str
  }

  const isString = (str) => {
    str = str.trim();
    return (isDouble(str) || isSingle(str)) && str[str.length - 2] !== '\\'
  };

  const quotes = (str) => {
    str = str.trim()
    // if (input[0] === '\"' && input[input.length - 1] === '\"') {
    return str.substring(1).slice(0, str.length - 2) || ''
  }

  const splitString = (inputChar) => {
    return function (str) {
      let outputArr = [];
      let arrayString = '';
      let lastCharacter = '';
      let insideArr = false;
      let insideObj = false;
      let arrBox = 0;
      let objBox = 0;
      let inDoubleQuotes = false;
      let inSingleQuotes = false;
      for (var i = 0; i < str.length; i++) {
        let characterCheck = str[i];

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
      return outputArr;
    }
  }

  let findCommas = splitString(',');
  let findColons = splitString(':');

  const decipherType = (str, parent) => {
    str = str.trim();

    if (isArray(str)) {
      return findCommas(quotes(str)).map(decipherType)
    }

    if (isObject(str)) {
      let formatted = {}
      let arrayObj = findCommas(quotes(str))
      arrayObj.forEach(function (key, index) {
        let organizeObj = findColons(key)
        if (organizeObj.length === 2) {
          formatted[decipherType(organizeObj[0])] = decipherType(organizeObj[1])
        }
      })
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
  
    throw SyntaxError('invalid stringified JSON')
  }
  return decipherType(json)
}

