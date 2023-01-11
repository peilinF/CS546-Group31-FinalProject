/* TODO: Import the functions from your three modules here 
and write two test cases for each function.. 
You should have a total of 18 test cases. 
do not forget that you need to create the package.json 
and add the start command to run app.js as the starting script*/

const arrayUttils = require('./arrayUtils');
console.log(arrayUttils.description);
try{
  console.log(arrayUttils.arrayStats([9,15,25.5,-5,5,7,10,5,11,30,4,1,-20]));
  console.log('arrayStats passed successfully');
}catch(e){
  console.log(e);
  console.log('arrayStats failed test case');
}

try{
  console.log(arrayUttils.arrayStats(["guitar", 1, 3, "apple"]));
  console.log('arrayStats passed successfully');
}catch(e){
  console.log(e);
  console.log('arrayStats failed test case');
}

try{
  console.log(arrayUttils.makeObjects([4, 1], [1, 2]));
  console.log('makeObjects passed successfully');
}catch(e){
  console.log(e);
  console.log('makeObjects failed test case');
}

try{
  console.log(arrayUttils.makeObjects(["foo", "bar"], ["name", "Patrick Hill"], ["foo", "not bar"]));
  console.log('makeObjects passed successfully');
}catch(e){
  console.log(e);
  console.log('makeObjects failed test case');
}

try{
  console.log(arrayUttils.commonElements([5, 7],[20, 5]));
  console.log('commonElements passed successfully');
}catch(e){
  console.log(e);
  console.log('commonElements failed test case');
}

try{
  console.log(arrayUttils.commonElements([1,2,"nope"]));
  console.log('commonElements passed successfully');
}catch(e){
  console.log(e);
  console.log('commonElements failed test case');
}



const stringUtils = require('./stringUtils');
console.log(stringUtils.description);
try{
  console.log(stringUtils.palindromes("Hi mom, At noon, I'm going to take my kayak to the lake"));
  console.log('palindromes passed successfully');
}catch(e){
  console.log(e);
  console.log('palindromes failed test case');
}

try{
  console.log(stringUtils.palindromes("Wow! Did you see that racecar go?"));
  console.log('palindromes passed successfully');
}catch(e){
  console.log(e);
  console.log('palindromes failed test case');
}

try{
  console.log(stringUtils.replaceChar("Daddy"));
  console.log('repalceChar passed successfully');
}catch(e){
  console.log(e);
  console.log('repalceChar failed test case');
}

try{
  console.log(stringUtils.replaceChar("Hello, How are you? I hope you are well"));
  console.log('repalceChar passed successfully');
}catch(e){
  console.log(e);
  console.log('repalceChar failed test case');
}

try{
  console.log(stringUtils.charSwap("Patrick", "Hill"));
  console.log('charSwap passed successfully');
}catch(e){
  console.log(e);
  console.log('charSwap failed test case');
}

try{
  console.log(stringUtils.charSwap("1234","5678"));
  console.log('charSwap passed successfully');
}catch(e){
  console.log(e);
  console.log('charSwap failed test case');
}



const objectUtils = require('./objectUtils');
console.log(objectUtils.description);
try{
  console.log(objectUtils.deepEquality({a: 2, b: 3},{a: 2, b: 4}));
  console.log('deepEquality passed successfully');
}catch(e){
  console.log(e);
  console.log('deepEquality failed test case');
}

try{
  console.log(objectUtils.deepEquality({1:2,a:3},[1,2,3]));
  console.log('deepEquality passed successfully');
}catch(e){
  console.log(e);
  console.log('deepEquality failed test case');
}

const first = {name: {first: "Patrick", last: "Hill"}, age: 46};
const second = {school: "Stevens", name: {first: "Patrick", last: "Hill"}};
try{
  console.log(objectUtils.commonKeysValues(first, second));
  console.log('commonKeysValues passed successful');
}catch(e){
  console.log(e);
  console.log('commonKeysValues failed test case');
}


try{
  console.log(objectUtils.commonKeysValues(first,{name: {first: "Patrick", last: "Hill", age: "46"}}))
  console.log('commonKeysValues passed successful');
}catch(e){
  console.log(e);
  console.log('commonKeysValues failed test case');
}

try{
  console.log(objectUtils.calculateObject({a:3,b:7,c:5},n => n * 2));
  console.log('calculateObject passed successfully');
}catch(e){
  console.log(e);
  console.log('calculateObject failed test case');
}

try{
  console.log(objectUtils.calculateObject({a:3,b:5,c:5}, n => n + 10));
  console.log('calculateObject passed successfully');
}catch(e){
  console.log(e);
  console.log('calculateObject failed test case');
}