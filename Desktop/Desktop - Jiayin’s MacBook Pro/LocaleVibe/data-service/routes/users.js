import express from "express";
import { createUser, getUserById, updateUserPatch, addEventToUser, removeEventFromUser} from "../data/users.js";
import { users } from "../config/mongoCollections.js";
import postValidation from "../validation/postValidation.js";

import multer from 'multer';
import {v4 as uuid} from 'uuid';

const router = express.Router();

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // __dirname在ES Modules中不可用，使用以下方式获取
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // 图片存储在后端根目录下的 'public' 文件夹中
    const dest = join(__dirname, '../public');
    cb(null, dest);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuid() + '-' + fileName)
  }
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("file in multer: ", file);
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});

//Only for testing
router.get("/", async (req, res) => {
  try {
    let usersCollection = users();

    let data = await usersCollection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
});

router.route("/register").post(async (req, res) => {
  try {
    console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let _id = req.body.uid;
    let result = await createUser(name, email, _id);
    console.log(result);
    res.json(result);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.json({ Authenticated: "logout" });
});

router.route("/:userId")
.get(async (req, res) => {
  try {
    const userInfo = await getUserById(req.params.userId);
    console.log(userInfo);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json(err);
  }
})
.patch(upload.single("imageURL"), async (req, res) => {
  let userInfo = req.body;
  console.log("patch req.body: ", req.body)
  if (!userInfo || Object.keys(userInfo).length === 0) {
    return res
      .status(400)
      .json({error: 'There are no fields in the request body'});
  }
  try{
    req.params.userId = req.params.userId.trim();
    if(req.params.userId.length === 0) throw 'Id cannot be an empty string or just spaces';
    if(typeof req.params.userId !== 'string' && typeof req.params.userId !== 'object') 
      throw 'Id must be a string or ObjectId';
    if(userInfo.name){
      if(typeof userInfo.name !== 'string') throw 'Name must be a string';
      if (userInfo.name.trim().length === 0)
        throw 'Name cannot be an empty string or just spaces';
      userInfo.name = userInfo.name.trim();
    }
  } catch (e) {
      return res.status(400).json({ error: e });
  }

  try {
    await getUserById(req.params.userId);
  } catch (e) {
    return res.status(400).json({error: e});
  }
  ;
  console.log("req.file: ", req.file);
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    console.log('the req file: ', req.file);
    userInfo.imageURL = url + '/public/' + req.file.filename;
  }

  try {
    const updatedUser = await updateUserPatch(req.params.userId, userInfo);
    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({error: e});
  }   
});


router.route("/addEventToUser/:userId/:eventId").post(async (req, res) => {
  let { userId, eventId } = req.params;
  try {
    userId = postValidation.checkString(userId);
    eventId = postValidation.checkString(eventId);
  } catch (e) {
    return res.status(400).json({ error: e.toString() });
  }

  try {
    let updateInfo = await addEventToUser(userId, eventId);
    res.status(200).json({ message: 'Joined the event successfully', updateInfo });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.route("/removeEventFromUser/:userId/:eventId").post(async (req, res) => {
  let { userId, eventId } = req.params;
  try {
    userId = postValidation.checkString(userId);
    eventId = postValidation.checkString(eventId);
  } catch (e) {
    return res.status(400).json({ error: e.toString() });
  }

  try {
    let updateInfo = await removeEventFromUser(userId, eventId);
    res.status(200).json({ message: 'Removed the event successfully', updateInfo });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});


export default router;