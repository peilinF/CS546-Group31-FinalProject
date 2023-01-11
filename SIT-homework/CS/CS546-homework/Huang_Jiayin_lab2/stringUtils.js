/* Todo: Implment the functions below and then export them
      using the module.exports syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/
let description = "This are string utility functions";

function checkIsStringUndefined(string){
  // check that string exists
  if(string === undefined){
    throw `${string || 'provided string'} is undefined`;
  }
}

function checkStringLength(string){
  // check the length of string is greater than 0
  // a string with just spaces is not valid
  if(string.length === 0){
    throw "Invalid string";
  }
}

function checkStringSpaces(string){
  let cur = 0;
  for(var i = 0; i < string.length; i++){
    if(string.charAt(i) === " "){
      cur += 1;
    }
  }
  if(cur === string.length){
    throw " A string with just spaces is not vaild";
  }
}

function checkIsString(string){
  // check that string is of the proper typr(string)   
  if(typeof string !== "string"){
    throw `${string || 'provided string'} is not a string`;
  }
}

// check if a word is palindromes
function checkIsPalindromes(str){
  if(str.length >= 2){
    let len = Math.floor(str.length /2);
    for(let i = 0; i < len; i++){
      if (str[i].toLowerCase() !== str[str.length - i - 1].toLowerCase()){
        return false;
      }
    }
    return true;
  }
}


let palindromes = (string) => {
   // check string
   checkIsStringUndefined(string);
   checkIsString(string);
   checkStringLength(string);
   checkStringSpaces(string);

   // declare an empty array to store every single words in string
   let currStr = [];
   // declare an empty array to store palindromes words
   let arr = [];
   for(var i = 0; i < string.length; i++){
      var ch = string.charAt(i);
      if(/[a-zA-Z]/g.test(ch)){
         currStr.push(ch);
      }else{
        //all the words before is not a letter
        if(currStr.length === 0){
          continue; 
        }else{ // stop by a special character or space, currStr[] has stored some letters
          // join all the letters
          var s = currStr.join("");
          // check if s is a palindromes
          if(checkIsPalindromes(s)){
            arr.push(s);
          }
          // clear currStr to scan next letter
          currStr = [];
        }
      }
    } // no special character or space between string
    if(currStr.length !== 0){
      // join all the letters
      var a = currStr.join("");
      // check if s is a palindromes
      if(checkIsPalindromes(a)){
        arr.push(a);
      }
    }
    return arr;
};

let replaceChar = (string) => {
  //check string
  checkIsStringUndefined(string);
  checkStringLength(string);
  checkStringSpaces(string);
  checkIsString(string);

  //declare an empty string to store resluts
  let str = "";
  let count = 1;
  for(var i = 0; i < string.length; i++){
    var ch = string.charAt(i);
    if(i === 0){ // keeep the first letter
      str += ch;
    }else if(i % 2 === 1){// if the index is odd number, the number needs to be replaced
      if(count % 2 === 1){ // if the count is odd number, the character will be "*"
        ch = '*';
        str += ch;
        count += 1; // count ++ after each replacements
      }else if (count % 2 === 0){ // if the count is even number, the character will be "$"
        ch = '$';
        str += ch;
        count += 1; //count ++ after each replacements
      }
    }else{
      str += ch;
    }
  }
  return str;
};

let charSwap = (string1, string2) => {
  // check each string
  checkIsStringUndefined(string1);
  checkIsStringUndefined(string2);
  checkIsString(string1);
  checkIsString(string2);
  checkStringSpaces(string1);
  checkStringSpaces(string2);
  if(string1.length < 4 || string2.length < 4){
    throw "The length of each string is at least 4 characters.";
  }

  // declare empty string to store the first four letters
  // declare an empty string to store return result
  let str = "";
  let str1 = "";
  let str2 = "";
  // declare an empty string to store swap string
  let str3 = "";
  let str4 = "";

  // find str1 first four characters
  for(var i = 0; i < 4; i++){
    str1 += string1.charAt(i);
  }

  // find str2 first four characters
  for(var i = 0; i < 4; i++){
    str2 += string2.charAt(i);
  }

  // combine with the rest of characters
  if(string1.length === 4 && string2.length === 4){
    return str = str2 + " " + str1;
  }

  if(string1.length === 4 && string2.length > 4){
    for(var i = 4; i < string.length; i++){
      str3 += string2.charAt(i);
    }
    str4 = str1 + str3;
    return str = str2 + " " + str4;
  }

  if(string1.length > 4 && string2.length === 4){
    for(var i = 4; i < string1.length; i++){
      str3 += string1.charAt(i);
    }
    str4 = str2 + str3;
    return str = str4 + " " + str1;
  }

  else{
    for(var i = 4; i < string1.length; i++){
      str3 += string1.charAt(i);
    }
    str3 = str2 + str3;

    for( var i = 4; i < string2.length; i++){
      str4 += string2.charAt(i);
    }
    str4 = str1 + str4;

    return str = str3 + " " + str4;
  }
  
};

module.exports = {
  description,
  palindromes,
  replaceChar,
  charSwap
}

