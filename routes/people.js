const express = require('express');
const router = express.Router();
const data = require('../data');
const peopleData = data.people;
const path = require('path');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/homepage.html'));

});

router.route("/searchpeople").post(async (req, res) => {
  //code here for POST
  let boday = req.body;
  let name = boday.searchPersonName;
  try {
    const people = await peopleData.searchPeopleByName(name);
    const peopleList = {searchPersonName: name, people: people};
    res.render('peopleFound', peopleList);
  } catch (e) {
    if (e === "No people found") {
      res.render('personNotFound', {hasError:true, searchPersonName: name});
      res.status(404);
      return;
    } else {
      res.render('error', {class: "searchpeople",error : e});
      res.status(400);
      return;
    }
  }
});


router.route("/persondetails/:id").get(async (req, res) => {
  //code here for GET
  let id = req.params.id;
  try {
    const person = await peopleData.searchPeopleByID(id);
    res.render('personFoundByID', person);
  } catch (e) {
    if (e === "No person found") {
      res.render('error', {class:"persondetails",error : `No person found with id: ${id}`});
      res.status(404);
      return;
  } else {
    res.render('error', {class:"persondetails",error : e});
    res.status(400);
    return;
  }
}
});
module.exports = router;