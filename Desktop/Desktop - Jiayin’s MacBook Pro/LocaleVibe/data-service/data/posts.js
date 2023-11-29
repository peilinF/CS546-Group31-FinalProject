import { posts } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from '../validation/postValidation.js';

const createError = (message) => new Error (message);

const createPost = async (
    user_id,
    imageURL,
    event_id,
    name,
    title,
    text
) => {
    user_id = validation.checkString(user_id);
    const userCollection = await users();
    let user_exist = await userCollection.findOne({_id: user_id});
    if (!user_exist) throw createError("User does not exist.");

    event_id = validation.checkString(event_id); //need more validation   
    name = validation.checkUsername(name);
    title = validation.checkTitle(title);
    text = validation.checkText(text);
    
    let datetime = new Date();
    datetime = datetime.toUTCString();

    const postData = {
        user_id: user_id,
        imageURL: imageURL,
        event_id: event_id,
        name: name,
        datetime: datetime,
        title: title,
        text: text,
        poll_id: null,
        comments: [],
    };

    const postCollection = await posts();
    const postInfo = await postCollection.insertOne(postData);
    if (!postInfo.acknowledged || !postInfo.insertedId) {
        throw createError("Cannot add this post.");
    }

    //save post_id in the user collection
    user_exist.posts = user_exist.posts || [];
    user_exist.posts.push(postInfo.insertedId.toString());

    const userInfo = await userCollection.updateOne(
        {_id: user_id},
        {$set : {posts: user_exist.posts}});      
    //console.log("save post id to user: ", userInfo);

    if (!userInfo.acknowledged) {
        throw createError("Cannot update user with post ID.");
    }
    
    return await getPostByPostId(postInfo.insertedId.toString());
}

const removePostByPostId = async (post_id) => {
    post_id = validation.checkStringObjectID(post_id);

    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(post_id)});
    if (!post) throw createError("Post does not exist.");
    //console.log("post to be deleted: ", post)

    let user_id = validation.checkString(post.user_id);
    const userCollection = await users();
    let user_exist = await userCollection.findOne({_id: user_id});
    if (!user_exist) throw createError("User dose not exist.");

    if (!user_exist.posts || !user_exist.posts.includes(post_id)) {
        throw createError("User does not have this post.");
    }

    const deleteInfo = await postCollection.deleteOne({_id: new ObjectId(post_id)});
    if (deleteInfo.deletedCount === 0) {
        throw createError(`Cannot delete post with ID: ${post_id}`);
    }
    
    //remove post from user collection
    const index = user_exist.posts.indexOf(post_id);
    if (index > -1) { // only splice array when item is found
        user_exist.posts.splice(index, 1); // 2nd parameter means remove one item only
    }
    const updateInfo = await userCollection.updateOne(
        {_id: user_id},
        {$set : {posts: user_exist.posts}});
    //console.log("remove user id from user: ", removeInfo);

    if (!updateInfo.acknowledged) {
        throw createError("Cannot remove post ID from user.");
    }
    
    return {deletePost: true};
}

const getPostByPostId = async (post_id) => {
    post_id = validation.checkStringObjectID(post_id);
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(post_id)});
    if (!post) throw createError(`Cannot find post with ID: ${post_id}`);
    post._id = post._id.toString();
    return post;
}

const getPostByEventId = async (event_id) => {
    const postCollection = await posts();
    const postByEventId = await postCollection.find({event_id: event_id}).toArray();
    if (!postByEventId) throw createError(`Cannot find posts for event with ID: ${event_id}`);
    return postByEventId;
}

const getPostByUserId = async (user_id) => {
    user_id = validation.checkString(user_id);
    const userCollection = await users();
    let user_exist = await userCollection.findOne({_id: user_id});
    if (!user_exist) throw createError("User does not exist.");

    const postCollection = await posts();
    const postByUserId = await postCollection.find({user_id: user_id}).toArray();
    if (!postByUserId) throw createError(`Cannot find posts for user with ID: ${user_id}`);
    return postByUserId;
}

const updateUserNameInPostById = async (postId, newName) => {
    newName = validation.checkUsername(newName);
  
    const postCollection = await posts();
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { name: newName } },
      { returnDocument: 'after' }
    );
  
    if (!updateResult.acknowledged) {
      throw createError("Failed to update user name in post.");
    }
  
    return updateResult;
  }

const updateUserImageInPostById = async (postId, imageURL) => {
    imageURL = validation.checkString(imageURL);
  
    const postCollection = await posts();
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { imageURL: imageURL } },
      { returnDocument: 'after' }
    );
  
    if (!updateResult.acknowledged) {
      throw createError("Failed to update user imageURL in post.");
    }
  
    return updateResult;
  }
  
const exportedMethods = {
    createPost,
    removePostByPostId,
    //updatePost,
    getPostByPostId,
    getPostByEventId,
    getPostByUserId,
    updateUserNameInPostById,
    updateUserImageInPostById
};

export default exportedMethods;