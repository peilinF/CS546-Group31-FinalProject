import express from "express";
import data from "../data/index.js";
import postValidation from "../validation/postValidation.js";

const checkString = postValidation.checkString;
const checkUsername = postValidation.checkUsername;
const checkStringObjectID = postValidation.checkStringObjectID;
const checkTitle = postValidation.checkTitle;
const checkText = postValidation.checkText;

const createPost = data.posts.createPost;
const getPostByEventId = data.posts.getPostByEventId;
const getPostByPostId = data.posts.getPostByPostId;
const removePostByPostId = data.posts.removePostByPostId;
const getPostByUserId = data.posts.getPostByUserId;

import { posts } from "../config/mongoCollections.js";

const router = express.Router();

//Only for testing
router.get("/", async (req, res) => {
  try {
    let postsCollection = posts();

    let data = await postsCollection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.route("/new").post(async (req, res) => {
  try {
    //console.log("/post/new req.body: \n", req.body);
    req.body.user_id = checkString(req.body.user_id);
    req.body.event_id = checkString(req.body.event_id);
    req.body.name = checkUsername(req.body.name);
    req.body.title = checkTitle(req.body.title);
    req.body.text = checkText(req.body.text);
  } catch (error) {
    return res.status(400).json({error: error.toString()});
  }
  try {
    let result = await createPost(
      req.body.user_id,
      req.body.imageURL,
      req.body.event_id,
      req.body.name,
      req.body.title,
      req.body.text
    );
    //console.log("/post/new.post: \n", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

router.route("/detail/:post_id").get(async (req, res) => {
  try {
    req.params.post_id = checkStringObjectID(req.params.post_id);
  } catch (error) {
    return res.status(400).json({error: error.toString()});
  }
  try {
    const postInfo = await getPostByPostId(req.params.post_id);
    console.log("/post/detail/:post_id.get: \n", postInfo);
    res.status(200).json(postInfo);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

router.route("/detail/:post_id").delete(async (req, res) => {
  try {
    req.params.post_id = checkStringObjectID(req.params.post_id);
  } catch (error) {
    return res.status(400).json({error: error.toString()});
  }
  try {
    const postInfo = await removePostByPostId(req.params.post_id);
    console.log("/post/detail/:post_id.delete: \n", postInfo);
    res.status(200).json(postInfo);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

router.route("/event/:event_id").get(async (req, res) => {
  try {
    req.params.event_id = checkString(req.params.event_id);
  } catch (error) {
    return res.status(400).json({error: error.toString()});
  }
  try {
    const postList = await getPostByEventId(req.params.event_id);
    console.log("/post/event/:event_id.get: \n", postList);
    res.status(200).json(postList);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

router.route("/user/:user_id").get(async (req, res) => {
  try {
    req.params.user_id = checkString(req.params.user_id);
  } catch (error) {
    return res.status(400).json({error: error.toString()});
  }
  try {
    const postList = await getPostByUserId(req.params.user_id);
    console.log("/post/user/:user_id.get: \n", postList);
    res.status(200).json(postList);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

export default router;
