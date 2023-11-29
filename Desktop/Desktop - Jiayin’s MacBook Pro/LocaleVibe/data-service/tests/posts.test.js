import { expect } from "chai";
import postData from '../data/posts.js';
import { createUser } from "../data/users.js";
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

let post1 = null;
let post2 = null;
let imageURL = "";
let user_id = "4tbeMum8S3eGSZEpKVWc7iMvgFN2";
let event_id = "692750504407";
let name = "Yetong Chen";
let db = null;

before(async () => {
    db = await dbConnection();
    await createUser(name, "cissieslab@gmail.com", user_id);
});

describe('Post Functions', function() {
    describe('createPost', function() {
        it('should create a post and return new post 1', async function() {
        post1 = await postData.createPost(user_id, imageURL, event_id, name, 'TestTitle1', 'TestText1');
        expect(post1).to.be.an('object');
        expect(post1).to.have.property('user_id', user_id);
        expect(post1).to.have.property('event_id', event_id);
        expect(post1).to.have.property('name', name);
        });

        it('should create a post and return new post 2', async function() {
        post2 = await postData.createPost(user_id, imageURL, event_id, name, 'TestTitle2', 'TestText2');
        expect(post2).to.be.an('object');
        expect(post2).to.have.property('user_id', user_id);
        expect(post2).to.have.property('event_id', event_id);
        expect(post2).to.have.property('name', name);
        });
    });

    describe('removePostByPostId', function() {
        it('should remove a post by its ID', async function() {
            // remove post2 just created
            const result = await postData.removePostByPostId(post2._id.toString());
            expect(result).to.deep.equal({ deletePost: true });
            // Validate that the post has been successfully deleted
        });
    });

    describe('getPostByPostId', function() {
        it('should retrieve a post by its ID', async function() {
            const retrievedPost = await postData.getPostByPostId(post1._id.toString());
            expect(retrievedPost).to.be.an('object');
        });
    });

    describe('getPostByEventId', function() {
        it('should retrieve posts by event ID', async function() {
            const postsByEvent = await postData.getPostByEventId(event_id);
            expect(postsByEvent).to.be.an('array');

        });
    });

    describe('getPostByUserId', function() {
        it('should retrieve posts by user ID', async function() {
            const postsByUser = await postData.getPostByUserId(user_id);
            expect(postsByUser).to.be.an('array');
        });

    });
});

after(async () => {
    await db.dropDatabase();
    await closeConnection();  
});

// //createPost
// try {
//     post1 = await postData.createPost(
//         "643477cd9042a9c9256c5ac5",
//         "643190719757",
//         'Yetong Chen',
//         "Nice dinner at Saka sushi",
//         "Nice food and environment.");
//     console.log("create post1 successfully", post1);
// } catch(e) {
//     console.log(e);
// }

// try {
//     post2 = await postData.createPost(
//         "63ddcbc4b3ffe78cebcbb5a1",
//         "692750504407",
//         'Xu Zhou',
//         "Hiking on weekend",
//         "Beautiful maples.");
//     console.log("create post2 successfully", post2);
// } catch(e) {
//     console.log(e);
// }

// try {
//     post3 = await postData.createPost(
//         "63ddcbc4b3ffe78cebcbb5a4",
//         "735668072007",
//         'Cong Guo',
//         "art museum travel",
//         "This museum tour was very interesting. I saw many paintings by artists and the explanations were very detailed. I will recommend this experience to friends and family and look forward to having such an opportunity next time.");
//     console.log("create post3 successfully", post3);
// } catch(e) {
//     console.log(e);
// }

// try {
//     post4 = await postData.createPost(
//         "63ddcbc4b3ffe78cebcbb5a8",
//         "735668072007",
//         'Amy Wang',
//         "museum tour",
//         "Amaing experience!");
//     console.log("create post4 successfully", post3);
// } catch(e) {
//     console.log(e);
// }

// //getPostByEventId
// try {
//     const postsEvent1 = await postData.getPostByEventId(post1.event_id);
//     console.log(postsEvent1);
// }catch(e){
//     console.log(e);
// }

// //getPostByUserId
// try {
//     const postUser2 = await postData.getPostByUserId(post2.user_id);
//     console.log(postUser2);
// }catch(e) {
//     console.log(e);
// }

// //removePostByPostId
// try {
//     const deleteInfo1 = await postData.removePostByPostId(post1._id.toString());
//     console.log(deleteInfo1);
// } catch(e) {
//     console.log(e);
// }

// //getPostByPostId
// try {
//     const newPost1 = await postData.getPostByPostId(post1._id.toString());
//     console.log(newPost1);
// }catch(e) {
//     console.log(e);//should throw not found error
// }

// try {
//     const newPost2 = await postData.getPostByPostId(post2._id.toString());
//     console.log(newPost2);
// }catch(e) {
//     console.log(e);
// }

// console.log('Done seeding database');
// await closeConnection();