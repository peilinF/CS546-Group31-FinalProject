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
const xss = require('xss');

const getorigin = async(park_state,req) =>{
  let user = await userData.getUserById(xss(req.session.user.userId));
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
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).send("You haven't logged in");
    return;
  }
  let user = await userData.getUserById(xss(req.session.user.userId));
  let park = user.parksHaveVisited;
  let visitlist=[]
  for(i=0;i<park.length;i++){
    visitlist.push(await ParkData.getParkById(park[i]));
  }
  res.send(visitlist);
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/parkwish").get(async (req, res) => {
  //code here for GET
  // let park_state = await parkData.getParkByState('AK');
  // res.render('../views/parkstate',{park: park_state,title:"Alaska"});
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).send("You haven't logged in");
    return;
  }
  let user = await userData.getUserById(xss(req.session.user.userId));
  let park = user.parksWishToGo;
  let wishlist=[]
  for(i=0;i<park.length;i++){
    wishlist.push(await ParkData.getParkById(park[i]));
  }
  res.send(wishlist);
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/record").get(async (req, res) => {
  if((xss(req.session.user)).length == 0){
    res.status(404).send("You haven't logged in");
    return;
  }
  try {
    const user = await userData.getUserById(xss(req.session.user.userId));
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
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AK');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Alaska"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/OR").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('OR');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Oregon"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/WA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WA');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Washington"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/CA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('CA');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"California"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/UT").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('UT');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Utah"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/TX").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('TX');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Texas"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NM").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NM');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"New Mexico"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/AZ").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AZ');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Arizona"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NV").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NV');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Nevada"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/CO").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('CO');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Colorado"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/WY").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WY');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Wyoming"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});
router.route("/MT").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MT');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Montana"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/ME").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('ME');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Maine"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/SD").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('SD');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"South Dakota"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/OH").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('OH');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Ohio"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/SC").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('SC');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"South Carolina"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/MO").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MO');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Missouri"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/AR").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AR');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Arkansas"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/IN").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('IN');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Indiana"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/MI").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MI');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Michigan"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/ND").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('ND');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"North Dakota"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/MN").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MN');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Minnesota"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/FL").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('FL');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Florida"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/TN").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('TN');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Tennessee"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/KY").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('KY');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"Kentucky"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/WV").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WV');
  park_state = await getorigin(park_state,req);
  res.render('../views/parkstate',{park: park_state,title:"West Virginia"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

//with no parks
router.route("/ID").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('ID');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Idaho"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Idaho"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NE").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NE');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Nebraska"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Nebraska"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/KS").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('KS');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Kansas"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Kansas"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/OK").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('OK');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Oklahoma"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Oklahoma"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/IA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('IA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Iowa"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Iowa"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/LA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('LA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Louisiana"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Louisiana"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/WI").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('WI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Wisconsin"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Wisconsin"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/IL").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('IL');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Illinois"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Illinois"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});
router.route("/MS").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MS');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Mississippi"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Mississippi"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/AL").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AL');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Alabama"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Alabama"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/GA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('GA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Georgia"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Georgia"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/PA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('PA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Pennsylvania"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Pennsylvania"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NC").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NC');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"North Carolina"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"North Carolina"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/MD").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MD');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Maryland"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Maryland"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/VA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Virginia"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Virginia"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NY").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NY');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"New York"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"New York"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NJ").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NJ');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"New Jersy"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"New Jersy"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/DE").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('DE');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Delaware"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Delaware"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/DC").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('DC');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"DC"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"DC"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/VT").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VT');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Vermont"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Vermont"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/NH").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('NH');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"New Hampshire"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"New Hampshire"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/MA").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MA');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Massachusettes"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Massachusettes"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/CT").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('CT');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Connecticut"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Connecticut"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/RI").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('RI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Rhode Island"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Rhode Island"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/VI").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('VI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"US Virgin Islands"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"US Virgin Islands"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/PR").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('PR');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Puerto Rico"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Puerto Rico"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/GU").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('GU');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Guam"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Guam"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/MP").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('MP');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Northern Mariana Islands"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Northern Mariana Islands"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/AS").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('AS');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"American Samoa"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"American Samoa"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/HI").get(async (req, res) => {
  //code here for GET
  try{
  if((xss(req.session.user)).length == 0){
    res.status(404).render('error', {title: 'Error Page',path: '/homepage', statuscode: 404, error: 'you have not logged in'});
    return;
  }
  let park_state = await parkData.getParkByState('HI');
  park_state = await getorigin(park_state,req);
  if(park_state==0){
    res.render('../views/noparkstate',{title:"Hawaii"});
    return;
  }
  res.render('../views/parkstate',{park: park_state,title:"Hawaii"});
}catch(e){
  res.status(500).send("failed to fetch data");
  return;
  }
});

router.route("/updatepark").post(async (req, res) => {
  try {
    if ((xss(req.session.user)).length == 0) {
      res.status(401).render('error', {title: 'Error Page', path: '/homepage', statuscode: 401, error: 'you have not logged in' });
      return;
    }
    let list = (xss(req.body.data)).split(',');
    let user = await userData.getUserById(xss(req.session.user.userId));
    let parkvisited = user.parksHaveVisited;
    let wish = user.parksWishToGo;
    let flag = [0, 0];
    for (i = 0; i < list.length; i++) {
      let record = [];
      record = list[i].split('@');
      for (j = 0; j < parkvisited.length; j++) {
        if (parkvisited[j] == record[0]) {
          flag[0] = 1;
        }
      }
      for (j = 0; j < wish.length; j++) {
        if (wish[j] == record[0]) {
          flag[1] = 1;
        }
      }
      if (record[1] == 'havebeen') {
        if (flag[0] == 0 && flag[1] == 1) {
          await userData.removeParksWishToGO(user._id, record[0]);
          await userData.addParksHaveVisited(user._id, record[0]);
        } else if (flag[1] == 0 && flag[0] == 1) {
          console.log('It is already in the list');
        } else if (flag[1] == 1 && flag[0] == 1) {
          await userData.removeParksWishToGO(user._id, record[0]);
        } else if (flag[1] == 0 && flag[0] == 0) {
          await userData.addParksHaveVisited(user._id, record[0]);
        }
      }
      if (record[1] == 'never') {
        if (flag[0] == 1 && flag[1] == 0) {
          await userData.removeParksHaveVisited(user._id, record[0]);
        } else if (flag[1] == 1 && flag[0] == 0) {
          await userData.removeParksWishToGO(user._id, record[0]);
        } else if (flag[1] == 1 && flag[0] == 1) {
          await userData.removeParksWishToGO(user._id, record[0]);
          await userData.removeParksHaveVisited(user._id, record[0]);
        } else if (flag[1] == 0 && flag[0] == 0) {
          console.log('No record on the list');
        }
      }
      if (record[1] == 'wish') {
        if (flag[0] == 1 && flag[1] == 0) {
          await userData.removeParksHaveVisited(user._id, record[0]);
          await userData.addParksWishToGO(user._id, record[0]);
        } else if (flag[1] == 0 && flag[0] == 1) {
          console.log('It is already in the list');
        } else if (flag[1] == 1 && flag[0] == 1) {
          await userData.removeParksHaveVisited(user._id, record[0]);
        } else if (flag[1] == 0 && flag[0] == 0) {
          await userData.addParksWishToGO(user._id, record[0]);
        }
      }
      flag = [0, 0];
    }
  } catch (e) {
    res.status(500).send("failed to fetch data");
    return;
  }
});
module.exports = router;
