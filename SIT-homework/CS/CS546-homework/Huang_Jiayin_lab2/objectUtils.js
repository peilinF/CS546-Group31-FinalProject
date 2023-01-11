/* Todo: Implment the functions below and then export them
      using the module.exports syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let description = "This are object utility functions";

//That obj1 and obj2 exists 
function checkIsObjectUndefined(object){
  if(typeof object === undefined){
    throw `${object || 'provided object'} is undefined`;
  }
}

//check the object is of proper type (an Object)
function checkIsObject(object){
  if(object.constructor !== Object){
    throw `${object || 'provided object'} is not a object`;
  }
}  
  
let deepEquality = (obj1, obj2) => {
  // check each object
  checkIsObjectUndefined(obj1);
  checkIsObjectUndefined(obj2);
  checkIsObject(obj1);
  checkIsObject(obj2);

  // Empty objects can be passed into this function
  if(obj1 === {} && obj2 === {}){
    return true;
  }

  if(Object.keys(obj1).length !== Object.keys(obj2).length){
    return false;
  }

  // for/in statement loops through the properties of an object:
  for(let x in obj1){
    if(obj1[x].constructor === Object && obj2.constructor === Object){
       if(deepEquality(obj1[x],obj2[x]) === false){
        return false;
       };      
    }else if(typeof obj1 !== typeof obj2){
        return false;
    }  
    else{
      if(obj1[x] !== obj2[x]){
        return false;
      }
    }
  }return true;
}

let commonKeysValues = (obj1, obj2) => {
  //check object
  checkIsObjectUndefined(obj1);
  checkIsObjectUndefined(obj2);
  checkIsObject(obj1);
  checkIsObject(obj2);

  // declare an empty object to store result
  let result = {};
  // Empty objects can be passed into this function
  if(obj1 === {} && obj2 === {}){
    return result;
  }
  // declare an empty array to store commonKeys
  let commonKeys = [];
  let obj1_Keys = Object.keys(obj1);
  let obj2_Keys = Object.keys(obj2);
  
  for(var i = 0; i < obj1_Keys.length; i++){
    for(var j = 0; j < obj2_Keys.length; j++){
      if(obj1_Keys[i] === obj2_Keys[j]){
        commonKeys.push(obj1_Keys[i]);
      }
    }
  }

  for(var i = 0; i < commonKeys.length; i++){
    if(obj1[commonKeys[i]].constructor !== Object && obj2[commonKeys[i]].constructor !== Object){
      if(obj1[commonKeys[i]] === obj2[commonKeys[i]]){
        result[commonKeys[i]] = obj1[commonKeys[i]];
      }
    }else if(typeof obj1[commonKeys[i]] !== typeof obj2[commonKeys[i]]){
      continue;
    }else{ // two objects same keys's values are objects
      commonKeysValues(obj1[commonKeys[i]],obj2[commonKeys[i]]);
      if(commonKeys.length === 0){
        continue; // keep scan the rest values in commonkeys
      }else{ // two sub objects has common keys
        // now the commkeys array is the sub objects common keys
        if(commonKeys.length !== Object.keys(obj1[commonKeys[i]]).length){
          continue;
        }
        for(var j =0 ; j < commonKeys.length; j++){
          if(obj1[commonKeys[i]][commonKeys[j]] !== obj2[commonKeys[i]][commonKeys[j]]){
             break;
          }
        }
        // if the sub objects are equal
        result[commonKeys[i]] = obj1[commonKeys[i]];
        // loop sub obj
        for(let x in obj1[commonKeys[i]]){
          result[x] = obj1[commonKeys[i]][x];
        }
      }
    }
  }
    return result; 
};

let calculateObject = (object, func) => {
  // check object
  checkIsObjectUndefined(object);
  checkIsObject(object);
  for(let x in object){
    if(typeof object[x] !== 'number'){
      throw `${object[x]} is not a number`;
    }
  }
  
  //check function
  if(typeof func !== 'function'){
    throw `${func || 'provided func'} is not a function`;
  };

  for(let x in object){
    object[x] = Number(Math.sqrt(func(object[x])).toFixed(2));
  }
  return object;  
};

module.exports = {
  description,
  deepEquality,
  commonKeysValues,
  calculateObject     
}
