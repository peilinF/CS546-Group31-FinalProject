import { createUser, getUserById, getUserByEmail, addPostToUser, addEventToUser, updateUserPatch } from '../data/users.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { expect } from "chai";
import postData from '../data/posts.js';

let user1 = null;
let name = "Cong Guo";
let email = "test1@gmail.com";
let user_id = "643477cd9042a9c9256c5ac5";
// const postId = "6545871a4fe1f1f1d524b364";
const eventId = "716620239427";
let db = null;
let post1 = {
  postId: "6545871a4fe1f1f1d524b364",
  user_id: "643477cd9042a9c9256c5ac5",
  event_id: "716620239427",
  name: "Cong Guo",
}

before(async () => {
  db = await dbConnection();
});

describe('User Functions', function() {
  describe('createPost', function() {
    it('should create a user and return new user 1', async function() {
      user1 = await createUser(
        name,
        email,
        user_id
      );
      expect(user1).to.be.an('object');
      expect(user1).to.have.property('_id', user_id);
      expect(user1).to.have.property('name', name);
      expect(user1).to.have.property('email', email);
      expect(user1).to.have.property('imageURL', "");
      expect(user1).to.have.property('posts');
      expect(user1).to.have.property('events');
      });
  });

  describe('getUserById', function() {
    it('should retrieve a user by ID', async function() {
      const userById = await getUserById(user1._id);
      expect(userById).to.be.an('object');
      expect(userById).to.have.property('_id', user_id);
      expect(userById).to.have.property('name', name);
      expect(userById).to.have.property('email', email);
      expect(userById).to.have.property('imageURL', "");
      expect(userById).to.have.property('posts');
      expect(userById).to.have.property('events');
    });
  });

  describe('getUserByEmail', function() {
    it('should retrieve a user by email', async function() {
      const userByEmail = await getUserByEmail(user1.email);
      expect(userByEmail).to.be.an('object');
      expect(userByEmail).to.have.property('_id', user_id);
      expect(userByEmail).to.have.property('name', name);
      expect(userByEmail).to.have.property('email', email);
      expect(userByEmail).to.have.property('imageURL', "");
      expect(userByEmail).to.have.property('posts');
      expect(userByEmail).to.have.property('events');
    });
  });

  describe('addPostToUser', function() {
    it('should add a post ID to a user', async function() {
      const addPostToUserResult = await addPostToUser(user1._id, post1.postId);
      expect(addPostToUserResult).to.have.property('acknowledged', true);
      expect(addPostToUserResult).to.have.property('modifiedCount', 1);
    });
  });

  describe('addEventToUser', function() {
    it('should add a event ID to a user', async function() {
      const addEventToUserResult = await addEventToUser(user1._id, eventId);
      expect(addEventToUserResult).to.have.property('acknowledged', true);
      expect(addEventToUserResult).to.have.property('modifiedCount', 1);
    });
  });
  
  describe('updateUserPatch', function() {
    it('should update user information and related posts', async function() {
      const userInfo = {
        name: 'user2_cong',
      };
      const updatedResult = await updateUserPatch(user1._id, userInfo);
      const updatedUser = updatedResult.updatedUserInfo;
      const postIds = user1.posts; 
  
      expect(updatedUser).to.be.an('object');
      expect(updatedUser).to.have.property('name', userInfo.name);

      for (const postId of postIds) {
        const updatedPost = await postData.getPostByPostId(postId);
        expect(updatedPost).to.be.an('object');
        expect(updatedPost).to.have.property('name', userInfo.name);
      }
    });
  });
});

after(async () => {
  await db.dropDatabase();
  await closeConnection(); 
});

// (async () => {
//   const db = await dbConnection();
//   await db.dropDatabase();

//   let user1 = null;

//   // Create User Test
//   try {
//     user1 = await createUser(
//       "Cong Guo",
//       "test1@gmail.com", 
//       "643477cd9042a9c9256c5ac5"
//     );
//     console.log("create user1 successfully", user1);
//   } catch (e) {
//     console.error('Failed to create user:', e);
//   }

//   const postId = "6545871a4fe1f1f1d524b364";
//   // Add Post to User Test
//   try {
//     const addPostToUserResult = await addPostToUser(user1._id, postId);
//     console.log("Post added to user successfully", addPostToUserResult);
//   } catch (e) {
//     console.error('Failed to add post to user:', e);
//   }

//   const eventId = "716620239427";
//   // Add Event to User Test
//   try {
//     const addEventToUserResult = await addEventToUser(user1._id, eventId);
//     console.log("Event added to user successfully", addEventToUserResult);
//   } catch (e) {
//     console.error('Failed to add event to user:', e);
//   }

//   await closeConnection();
// })();
