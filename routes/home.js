const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');
const parkData = require('../data/park_state');
const ParkData = require('../data/parks');
const { title } = require('process');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const getorigin = async(park_state,req) =>{
  let user = await userData.getUserById(req.session.user.userId);
  let parkvisited = user.parksHaveVisited;
  let wish = user.parksWishToGo;
  let flag = [0,0];
  for(i=0;i<park_state.length;i++){
    for(j=0;j<parkvisited.length;j++){
      if(parkvisited[j]==park_state[i]._id){
        flag[0]=1;
      }
    }
    for(j=0;j<wish.length;j++){
      if(wish[j]==park_state[i]._id){
        flag[1]=1;
      }
    }
    if(flag[0]==1&&flag[1]==0){
      park_state[i].h0='selected';
      park_state[i].h1='';
      park_state[i].h2='';
    }else if(flag[0]==0&&flag[1]==1){
      park_state[i].h2='selected';
      park_state[i].h1='';
      park_state[i].h0='';
    }else if(flag[0]==0&&flag[1]==0){
      park_state[i].h1='selected';
      park_state[i].h0='';
      park_state[i].h2='';
    }
    flag = [0,0];
  }
  return park_state;
}

router.route("/").get(async (req, res) => {
  //code here for GET
 req.session.pageNow = '/';
 if(req.session.user){
  res.render('homepage',{userName: req.session.user.userName});
 }else{
  res.sendFile(path.resolve('static/homepage.html'));
 }
});

router.route("/parkvisited").get(async (req, res) => {
  //code here for GET
  // let park_state = await parkData.getParkByState('AK');
  // res.render('../views/parkstate',{park: park_state,title:"Alaska"});
  if(typeof(req.session.user) == "undefined"){
    res.status(404).send("You haven't logged in");
    return;
  }
  let user = await userData.getUserById(req.session.user.userId);
  let park = user.parksHaveVisited;
  let visitlist=[]
  for(i=0;i<park.length;i++){
    visitlist.push(await ParkData.getParkById(park[i]));
  }
  res.send(visitlist);
});

router.route("/parkwish").get(async (req, res) => {
  //code here for GET
  // let park_state = await parkData.getParkByState('AK');
  // res.render('../views/parkstate',{park: park_state,title:"Alaska"});
  if(typeof(req.session.user) == "undefined"){
    res.status(404).send("You haven't logged in");
    return;
  }
  let user = await userData.getUserById(req.session.user.userId);
  let park = user.parksWishToGo;
  let wishlist=[]
  for(i=0;i<park.length;i++){
    wishlist.push(await ParkData.getParkById(park[i]));
  }
  res.send(wishlist);
});

router.route("/record").get(async (req, res) => {
  if(typeof(req.session.user) == "undefined"){
    res.status(404).send("You haven't logged in");
    return;
  }
  try {
    const user = await userData.getUserById(req.session.user.userId);
    const record = {
      wishedAmount: user.parksWishToGo.length,
      visitedAmount: user.parksHaveVisited.length
    }
    res.status(200).send(record)
    return;
  } catch (e) {
    res.status(500).send("failed to fetch data");
    return;
  }
})

router.route("/AK").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AK');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Alaska"});
});

router.route("/OR").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('OR');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Oregon"});
});

router.route("/WA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WA');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Washington"});
});

router.route("/CA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('CA');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"California"});
});

router.route("/UT").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('UT');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Utah"});
});

router.route("/TX").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('TX');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Texas"});
});

router.route("/NM").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NM');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"New Mexico"});
});

router.route("/AZ").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AZ');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Arizona"});
});

router.route("/NV").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NV');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Nevada"});
});

router.route("/CO").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('CO');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Colorado"});
});

router.route("/WY").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WY');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Wyoming"});
});

router.route("/MT").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MT');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Montana"});
});

router.route("/ME").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('ME');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Maine"});
});

router.route("/SD").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('SD');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"South Dakota"});
});

router.route("/OH").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('OH');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Ohio"});
});

router.route("/SC").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('SC');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"South Carolina"});
});

router.route("/MO").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MO');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Missouri"});
});

router.route("/AR").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AR');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Arkansas"});
});

router.route("/IN").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('IN');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Indiana"});
});

router.route("/MI").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MI');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Michigan"});
});

router.route("/ND").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('ND');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"North Dakota"});
});

router.route("/MN").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MN');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Minnesota"});
});

router.route("/FL").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('FL');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Florida"});
});

router.route("/TN").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('TN');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Tennessee"});
});

router.route("/KY").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('KY');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Kentucky"});
});

router.route("/WV").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WV');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"West Virginia"});
});

//with no parks
router.route("/ID").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"US Virgin Islands"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"US Virgin Islands"});
});

router.route("/NE").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NE');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Nebraska"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Nebraska"});
});

router.route("/KS").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('KS');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Kansas"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Kansas"});
});

router.route("/OK").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('OK');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Oklahoma"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Oklahoma"});
});

router.route("/IA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('IA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Iowa"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Iowa"});
});

router.route("/LA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('LA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Louisiana"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Louisiana"});
});

router.route("/WI").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Wisconsin"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Wisconsin"});
});

router.route("/IL").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('IL');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Illinois"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Illinois"});
});

router.route("/MS").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MS');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Mississippi"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Mississippi"});
});

router.route("/AL").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AL');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Alabama"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Alabama"});
});

router.route("/GA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('GA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Georgia"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Georgia"});
});

router.route("/PA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('PA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Pennsylvania"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Pennsylvania"});
});

router.route("/NC").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NC');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"North Carolina"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"North Carolina"});
});

router.route("/MD").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MD');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Maryland"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Maryland"});
});

router.route("/VA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Virginia"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Virginia"});
});

router.route("/NY").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NY');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"New York"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"New York"});
});

router.route("/NJ").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NJ');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"New Jersy"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"New Jersy"});
});

router.route("/DE").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('DE');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Delaware"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Delaware"});
});

router.route("/DC").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('DC');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"DC"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"DC"});
});

router.route("/VT").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VT');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Vermont"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Vermont"});
});

router.route("/NH").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NH');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"New Hampshire"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"New Hampshire"});
});

router.route("/MA").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Massachusettes"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Massachusettes"});
});

router.route("/CT").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('CT');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Connecticut"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Connecticut"});
});

router.route("/RI").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('RI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Rhode Island"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Rhode Island"});
});

router.route("/VI").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"US Virgin Islands"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"US Virgin Islands"});
});

router.route("/PR").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('PR');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Puerto Rico"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Puerto Rico"});
});

router.route("/GU").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('GU');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Guam"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Guam"});
});

router.route("/MP").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MP');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Northern Mariana Islands"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Northern Mariana Islands"});
});

router.route("/AS").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AS');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"American Samoa"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"American Samoa"});
});

router.route("/HI").get(async (req, res) => {
  //code here for GET
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('HI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Hawaii"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Hawaii"});
});

router.route("/updatepark").post(async (req, res) => {
  if(typeof(req.session.user) == "undefined"){
    res.status(404).render('error', {path: '/homepage', statucode: 404, error: 'you have not logged in'});
    return;
  }
  let list = req.body.data;
  let user = await userData.getUserById(req.session.user.userId);
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
        await userData.removeParksWishToGO(user._id,record[0]);
        await userData.addParksHaveVisited(user._id,record[0]);
      }else if(flag[1]==0&&flag[0]==1){
        console.log('It is already in the list');
      }else if(flag[1]==1&&flag[0]==1){
        await userData.removeParksWishToGO(user._id,record[0]);
      }else if(flag[1]==0&&flag[0]==0){
        await userData.addParksHaveVisited(user._id,record[0]);
      }
    }
    if(record[1]=='never'){
      if(flag[0]==1&&flag[1]==0){
        await userData.removeParksHaveVisited(user._id,record[0]);
      }else if(flag[1]==1&&flag[0]==0){
        await userData.removeParksWishToGO(user._id,record[0]);
      }else if(flag[1]==1&&flag[0]==1){
        await userData.removeParksWishToGO(user._id,record[0]);
        await userData.removeParksHaveVisited(user._id,record[0]);
      }else if(flag[1]==0&&flag[0]==0){
        console.log('No record on the list');
      }
    }
    if(record[1]=='wish'){
      if(flag[0]==1&&flag[1]==0){
        await userData.removeParksHaveVisited(user._id,record[0]);
        await userData.addParksWishToGO(user._id,record[0]);
      }else if(flag[1]==0&&flag[0]==1){
        console.log('It is already in the list');
      }else if(flag[1]==1&&flag[0]==1){
        await userData.removeParksHaveVisited(user._id,record[0]);
      }else if(flag[1]==0&&flag[0]==0){
        await userData.addParksWishToGO(user._id,record[0]);
      }
    }
    flag =[0,0];
  }
});
module.exports = router;
