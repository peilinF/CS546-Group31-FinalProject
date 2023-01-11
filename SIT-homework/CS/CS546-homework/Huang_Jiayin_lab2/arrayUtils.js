/* Todo: Implment the functions below and then export them
      using the module.exports syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/
let description = "This are array utility functions";

function checkIsArrayUndefined(array){
  // check the array exists
  if(typeof array === undefined){
    throw `${array || 'provided array'} is undefined`;
  }
}

function checkIsArray(array){
  // check the array is of the proper type(meaning it's an array)
  if(!Array.isArray(array)){
    throw `${array || 'provided array'} is not array`;
  }
}
  
function checkIsArrayEmpty(array){
    // check the array is not empty
    if(array.length === 0){
      throw`${array || 'provided array'} is empty`;
    }
}

function checkIsArrayNumber(array){
  //check each array element is a number
  for(let i = 0; i < array.length; i++){
    if(typeof array[i] !== 'number'){
      throw `${array[i] || 'provided array elements'} is not a number`;
    }
  }
}


let arrayStats=(array) => {
    // declare an empty obj to store return results
    let obj = {};

    // check array
    checkIsArrayUndefined(array);
    checkIsArray(array);
    checkIsArrayEmpty(array);
    checkIsArrayNumber(array);
    // sort the array
    array.sort((a, b) => a - b);

    // find the sum of array
    let sum = 0;
    for(i = 0; i < array.length; i++){
      sum += array[i];
    }
    obj.sum = sum;
    
    // find mean
    obj.mean = sum / array.length;
     
    //check for even or odd
    // find middle index 
    //reurn median
    let mid = Math.floor(array.length / 2);
    obj.median = array.length % 2 !== 0 ? array[mid] : (array[mid -1] + array[mid]) / 2;

    // set the first number as maxium 
    let maxium = array[0];
    // find the maxium value in the array
    for(i = 0; i < array.length; i++){
      if(array[i] > maxium){
         maxium = array[i];
      }
    }
    obj.maxium = maxium;
    
    // set the first numer as minmum
    let minimum = array[0];
    // find the minium value in the array
    for(i = 0; i < array.length; i++){
      if(array[i] < minimum){
        minimum = array[i];
      }
    }
    obj.minimum = minimum;

    //declare an empty map to count number repeating times
    let map ={};
    for (let i = 0; i < array.length; ++i){
      //let array[i] value as map's key, array[i] repeat times as map key's value
      if(array[i] in map){// if the key already exits, means that its value repeats
        //increment existing key's value
        map[array[i]] += 1;
      }else{// if the key doesn't exit in the map, means that it's the first time find the key
        //make a new key and set its value to 1
        map[array[i]] = 1;
      }
    }
    // store map's key as an array so we could loop it later
    let mapKeys = Object.keys(map);

    // assign a value guaranteed to be smaller than any number in the array
    let maxKey = -1;
    let maxRepeatValue = -1;
    // finding the biggest RepeatValue and its corresponding key
    for(let i = 0; i < mapKeys.length;i++){
      if(map[mapKeys[i]] > maxRepeatValue){
        maxRepeatValue =  map[mapKeys[i]];
        maxKey = mapKeys[i];
      }
    }
    if (maxRepeatValue === 1) {
        obj.mode = 0;
    }else{
      // declare an empty array to store mode
    // if there is more than one mode, return an array
     let ans = [];

    // find mode
     for (let i = 0; i < mapKeys.length; i++) {
        if (map[mapKeys[i]] === maxRepeatValue) {
            ans.push(Number(mapKeys[i]));
        }
     }

     // determine if there are multiple modes
     if (ans.length == 1) {
        obj.mode = ans[0];
     } else {
        obj.mode = ans;
     }
    }

    obj.range = maxium - minimum;
    obj.count = array.length;

    return obj;
};

let makeObjects = (...arrays) => {
//this function takes in a variable number of arrays that's what the ...arrays signifies
    for(let i = 0; i < arrays.length; i++){
      if(arrays[i] === undefined){
        throw `${arrays[i] || 'provided array'} is undefined`;
      }
      //check Each array is of the proper type (meaning, it's an array)
      if(! Array.isArray(arrays[i])){
        throw `${arrays[i] || 'provided array'} is not array`;
      }
      // check Each array is not empty
      if(arrays[i].length === 0){
        throw`${arrays[i] || 'provided array'} is empty`;
      }
      //Each array has two and only two elements
      if(arrays[i].length !== 2){
        throw`${arrays[i]} length is not equal 2`
      }
    }

    // declare an empty object to store result
    let obj = {};
    for(let i = 0; i < arrays.length; i++){
      obj[arrays[i][0]] = arrays[i][1]; // update value automatically
    }
    return obj;
};


// funtion helper
function isEqualArr(arr1, arr2) {
  if (arr1.length === arr2.length) {
    for (var i = 0 ; i < arr1.length; ++i) {
      if (typeof arr1[i] === typeof arr2[i]) {
        if (Array.isArray(arr[i])) {
          if (!isEqualArr(arr1[i], arr2[i])) {
            return false;
          }
        } else {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function isIncludeElement(arr, element) {
  if (Array.isArray(element)) {
    for (var i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        if (isEqualArr(arr[i], element)) {
          return true;
        }
      }
    }
    return false;
  } else {
    return arr.includes(element);
  }

}
// [1, 2, [1, 2]] => arr
// [[1, 2]] => element


let commonElements = (...arrays) => {
//this function takes in a variable number of arrays that's what the ...arrays signifies
    for(let i = 0; i < arrays.length; i++){
      if(arrays[i] === undefined){
        throw `${arrays[i] || 'provided array'} is undefined`;
      }
      //That each input is an array
      //there are at LEAST two arrays passed in as input parameters.
      if(!Array.isArray(arrays[i]) || arrays.length < 2){
        throw "arrays has to be array and please at lease input two arrays";
      }
      //check Each array is not empty
      if(arrays[i].length === 0){
        throw`${arrays[i] || 'provided array'} is empty`;
      }
    }
    var ans = [...arrays].reduce((a, b) => a.filter(i => isIncludeElement(b, i)));
    return ans;    
};

module.exports = {
  description,
  arrayStats,
  makeObjects,
  commonElements
}
