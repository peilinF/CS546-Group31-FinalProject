const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const userData = data.users;
const parkData = data.parks;
const reviewData = data.reviews;
const path = require('path');
const xss = require('xss');

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      const userEmail = xss(req.session.user.email)
      try {
        const user = await userData.getUserByEmail(userEmail)
        res.status(200).render('profile',{title:"profile", isPark: true, hideTitle: true, user: user, myProfile: true});
      } catch (e) {
        if (e === "User not found") {
          res.status(404).render('error', {title: 'Error Page', path: '/profile', statuscode: 404, error: e })
          return;
        } else {
          res.status(400).render('error', {title: 'Error Page', path: '/profile', statuscode: 400, error: e })
        }
      }
    } else {
      error = "Error page saying that the user is not logged in";
      res.status(401).render('../views/forbiddenAccess', { error: error, statuscode: 401, title: "Non-Authenticated!" });
      return
    }
  });


router.route("/update").post(async (req, res) => {
  if (!req.session.user) {
    let error = 'You have to login to add review!';
    res.status(400).render('userLogin', { error: error, title: "login!" });
    return;
  }
  const userId = xss(req.body.userId)
  const userName = xss(req.body.userName)
  const userEmail = xss(req.body.email)
  const userBirthDate = xss(req.body.birthDate)
  const hashedPassword = xss(req.body.hashedPassword)
  try {
    helper.checkparamsUpdateUser(userId, userName, userEmail, userBirthDate, hashedPassword)
  } catch (e) {
    res.status(400).render('error', {title: 'Error Page', path: 'user/update', statuscode: 400, error: e })
    return;
  }
  if (req.session.user.userId !== userId) {
    let error = 'Forbidden, you can not change profile of other user!';
    res.status(403).render('error', {title: 'Error Page', error: error, statuscode: 403, error: error });
    return;
  }
  try {
    const user = await userData.getUserByEmail(userEmail)
    if (userName == user.userName && userEmail == user.email && userBirthDate == user.birthDate) {
      console.log()
      res.redirect('/profile')
      return;
    }
    updatedUser = await userData.updateUser(userId, userName, userEmail, userBirthDate, hashedPassword)
    req.session.user.userName = userName
    res.redirect('/profile')
    return;
  } catch (e) {
    res.status(500).render('error', {title: 'Error Page', path: 'user/update', statuscode: 500, error: e })
    return;
  }
})

router.route("/parkList").get(async (req, res) => {
  if (!req.query.userName) {
    res.status(400).send("No user name");
  }
  try {
    const user = await userData.getUserByName(req.query.userName);
    let parkWishList = user.parksWishToGo;
    let parkVisitedList = user.parksHaveVisited;
    parkWishList = await Promise.all(parkWishList.map(async park => {
      park = await parkData.getParkById(park)
      return park.parkName
    }));
    parkVisitedList = await Promise.all(parkVisitedList.map(async park => {
      park = await parkData.getParkById(park)
      return park.parkName
    }));
    const parkNameList = {
      parkWishList: parkWishList,
      parkVisitedList: parkVisitedList
    }
    res.status(200).send(parkNameList);
    return;
  } catch (e) {
    res.status(500).send("failed to fetch data");
    return;
  }
})

router.route("/reviewList").get(async (req, res) => {
  if (!req.query.userName) {
    res.status(400).send("No user name");
  }
  try {
    const user = await userData.getUserByName(req.query.userName);
    let reviewList = await reviewData.getAllUserReviews(user._id.toString());
    res.status(200).send(reviewList);
    return;
  } catch (e) {
    res.status(500).send("failed to fetch data");
    return;
  }
})

module.exports = router;