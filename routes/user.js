const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');
const xss = require('xss');
const helper = require("../helpers");

router.route("/search/name").get(async (req, res) => {
  const userName = xss(req.query.searchUserName);
  try {
    helper.validUserName(userName)
  } catch (e) {
    res.status(400).render('error', {title: 'Error Page',path: 'user/search/name', statuscode: 400, error: e})
  }
  try {
    const user = await userData.getUserByName(userName)
    if (user === false) throw "User not found"
    res.status(200).render('profile', {title: "profile", isPark: true, hideTitle: true, user: user })
    return;
  } catch (e) {
    if (e === "User not found") {
      res.status(404).render('error', {title: 'Error Page',path: 'user/search/name', statuscode: 404, error: e})
      return;
  }
  res.status(400).render('error', {title: 'Error Page',path: 'user/search/name', statuscode: 400, error: e})
  return;
}
})

// router.route("/persondetails/:id").get(async (req, res) => {
//   //code here for GET
//   let id = req.params.id;
//   try {
//     const person = await userData.searchuserByID(id);
//     res.render('personFoundByID', person);
//   } catch (e) {
//     if (e === "No person found") {
//       res.render('error', {class:"persondetails",error : `No person found with id: ${id}`});
//       res.status(404);
//       return;
//   } else {
//     res.render('error', {class:"persondetails",error : e});
//     res.status(400);
//     return;
//   }
// }
// });
module.exports = router;