const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');
const parkData = require('../data/park_state');
const { title } = require('process');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/homepage.html'));
});
router.route("/AK").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('AK');
  res.render('../views/parkstate',{park: park_state,title:"Alaska"});
});

router.route("/OR").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('OR');
  res.render('../views/parkstate',{park: park_state,title:"Oregon"});
});

router.route("/WA").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('WA');
  res.render('../views/parkstate',{park: park_state,title:"Washington"});
});

router.route("/CA").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('CA');
  res.render('../views/parkstate',{park: park_state,title:"California"});
});

router.route("/UT").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('UT');
  res.render('../views/parkstate',{park: park_state,title:"Utah"});
});

router.route("/TX").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('TX');
  res.render('../views/parkstate',{park: park_state,title:"Texas"});
});

router.route("/NM").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('NM');
  res.render('../views/parkstate',{park: park_state,title:"New Mexico"});
});

router.route("/AZ").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('AZ');
  res.render('../views/parkstate',{park: park_state,title:"Arizona"});
});

router.route("/NV").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('NV');
  res.render('../views/parkstate',{park: park_state,title:"Nevada"});
});

router.route("/CO").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('CO');
  res.render('../views/parkstate',{park: park_state,title:"Colorado"});
});

router.route("/WY").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('WY');
  res.render('../views/parkstate',{park: park_state,title:"Wyoming"});
});

router.route("/MT").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('MT');
  res.render('../views/parkstate',{park: park_state,title:"Montana"});
});

router.route("/ME").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('ME');
  res.render('../views/parkstate',{park: park_state,title:"Maine"});
});

router.route("/SD").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('SD');
  res.render('../views/parkstate',{park: park_state,title:"South Dakota"});
});

router.route("/OH").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('OH');
  res.render('../views/parkstate',{park: park_state,title:"Ohio"});
});

router.route("/SC").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('SC');
  res.render('../views/parkstate',{park: park_state,title:"South Carolina"});
});

router.route("/MO").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('MO');
  res.render('../views/parkstate',{park: park_state,title:"Missouri"});
});

router.route("/AR").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('AR');
  res.render('../views/parkstate',{park: park_state,title:"Arkansas"});
});

router.route("/IN").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('IN');
  res.render('../views/parkstate',{park: park_state,title:"Indiana"});
});

router.route("/MI").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('MI');
  res.render('../views/parkstate',{park: park_state,title:"Michigan"});
});

router.route("/NY").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('NY');
  res.render('../views/parkstate',{park: park_state,title:"New York"});
});

router.route("/VA").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('VA');
  res.render('../views/parkstate',{park: park_state,title:"Virginia"});
});

router.route("/ND").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('ND');
  res.render('../views/parkstate',{park: park_state,title:"North Dakota"});
});

router.route("/MN").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('MN');
  res.render('../views/parkstate',{park: park_state,title:"Minnesota"});
});

router.route("/FL").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('FL');
  res.render('../views/parkstate',{park: park_state,title:"Florida"});
});

router.route("/TN").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('TN');
  res.render('../views/parkstate',{park: park_state,title:"Tennessee"});
});

router.route("/KY").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('KY');
  res.render('../views/parkstate',{park: park_state,title:"Kentucky"});
});

router.route("/WV").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('WV');
  res.render('../views/parkstate',{park: park_state,title:"West Virginia"});
});

router.route("/VI").get(async (req, res) => {
  //code here for GET
  let park_state = await parkData.getParkByState('VI');
  res.render('../views/parkstate',{park: park_state,title:"US Virgin Islands"});
});

router.route("/updatepark").post(async (req, res) => {
  let list = req.body.data;
  let user = await userData.getUserById('639533bfc975f24f3729273e');
  let parkvisited = user.parksHaveVisited;
  let wish = user.parksWishToGo;
  let flag =[0,0];
  for(i=0;i<list.length;i++){
    let record = [];
    record = list[i].split('@');
    for(j=0;j<parkvisited.length;j++){
      if(parkvisited[j]==record[0]){
        flag[0]=1;
      }
    }
    for(j=0;j<wish.length;j++){
      if(wish[j]==record[0]){
        flag[1]=1;
      }
    }
    if(record[1]=='havebeen'){
      if(flag[0]==0&&flag[1]==1){
        await userData.removeParksWishToGO('639533bfc975f24f3729273e',record[0]);
        await userData.addParksHaveVisited('639533bfc975f24f3729273e',record[0]);
      }else if(flag[1]==0&&flag[0]==0){
        await userData.addParksHaveVisited('639533bfc975f24f3729273e',record[0]);
      }else if(flag[1]==1&&flag[0]==1){
        await userData.removeParksWishToGO('639533bfc975f24f3729273e',record[0]);
      }
    }
    if(record[1]=='never'){
      if(flag[0]==1&&flag[1]==0){
        await userData.removeParksHaveVisited('639533bfc975f24f3729273e',record[0]);
      }else if(flag[1]==1&&flag[0]==0){
        await userData.removeParksWishToGO('639533bfc975f24f3729273e',record[0]);
      }else if(flag[1]==1&&flag[0]==1){
        await userData.removeParksWishToGO('639533bfc975f24f3729273e',record[0]);
        await userData.removeParksHaveVisited('639533bfc975f24f3729273e',record[0]);
      }
    }
    if(record[1]=='wish'){
      if(flag[0]==1&&flag[1]==0){
        await userData.removeParksHaveVisited('639533bfc975f24f3729273e',record[0]);
        await userData.addParksWishToGO('639533bfc975f24f3729273e',record[0]);
      }else if(flag[1]==0&&flag[0]==0){
        await userData.addParksWishToGO('639533bfc975f24f3729273e',record[0]);
      }else if(flag[1]==1&&flag[0]==1){
        await userData.removeParksHaveVisited('639533bfc975f24f3729273e',record[0]);
      }
    }
    flag =[0,0];
  }
});
module.exports = router;