import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pagination, Input, Tabs, Modal } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EventOfDateCard from "./EventOfDateCard";
import PostCard from "./PostCard";
import { Grid } from "@mui/material";
import noImage from "../images/no-image.png";

function UserProfile() {
  //const [userInfo, setUserInfo] = useState({});
  const [userComments, setUserComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImg, setEditImg] = useState("");
  const [showImg, setShowImg] = useState("");
  const [savedEvents, setSavedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPageComments, setCurrentPageComments] = useState(1);
  const [currentPageEvents, setCurrentPageEvents] = useState(1);
  const pageSize = 10;

  //const auth = getAuth();
  const [user, setUser] = useState(null);
  const auth = getAuth(); // 获取 Firebase Auth 的实例
  const [userInfo, setUserInfo] = useState(null); // 新状态来存储从你的后端获取的用户信息

  const [eventCardsData, seteventCardsData] = useState(null);
  const [postCardsData, setpostCardsData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  // 新的 useEffect 钩子来获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:4000/users/${user.uid}`
          );
          setUserInfo(response.data);
          console.log("response data: ", response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        // 如果用户未登录，清除 userInfo
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    async function setData() {
      try {
        setUserComments(userInfo.posts);
        setSavedEvents(userInfo.events);
        console.log("userInfo: ", userInfo);
      } catch (e) {
        console.log(e);
      }
    }
    setData();
  }, [userInfo]);

  useEffect(() => {
    async function getEventCards() {
      try {
        let res =
          savedEvents &&
          savedEvents.map((id) => {
            return <EventOfDateCard 
            eventId={id} 
            key={id} 
            onMoveEvent={() => handleMoveEvent(id)}
            showMoveButton={true}
            />;
          });
        seteventCardsData(res);
      } catch (error) {
        console.log(error);
      }
    }
    getEventCards();
  }, [savedEvents]);

  useEffect(() => {
    async function getPostCards() {
      console.log("userComments: ", userComments);
      try {
        let res =
          userComments &&
          userComments.map((id) => {
            return (
              <PostCard
                postId={id}
                key={id}
                onDelete={() => handleDeletePostById(id)}
              />
            );
          });
        setpostCardsData(res);
      } catch (error) {
        console.log(error);
      }
    }
    getPostCards();
  }, [userComments]);

  const currentComments = (filteredComments.length > 0 ? filteredComments : userComments) || [];
  const paginatedComments = currentComments.slice((currentPageComments - 1) * pageSize, currentPageComments * pageSize);
  const paginatedEvents = (savedEvents || []).slice((currentPageEvents - 1) * pageSize, currentPageEvents * pageSize);



  const handleDeletePostById = async (id) => {
    const url = `http://localhost:4000/post/detail/${id}`;
    try {
      const response = await axios.delete(url);
      let newComments = userComments.filter((comment) => comment !== id);
      console.log(newComments);
      setUserComments(newComments);
      let res = newComments.map((id) => {
        return (
          <PostCard
            postId={id}
            key={id}
            onDelete={() => handleDeletePostById(id)}
          />
        );
      });
      setpostCardsData(res);
      console.log("postData", response);
    } catch (error) {
      console.error("Error when delete post", error);
    }
  };

  const handleSearchComments = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = userComments.filter((comment) =>
      comment.toLowerCase().includes(value)
    );
    setFilteredComments(filtered);
    setCurrentPageComments(1);
  };

  const handleSearchEvents = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = savedEvents.filter((event) =>
      event.toLowerCase().includes(value)
    );
    setFilteredEvents(filtered);
    setCurrentPageEvents(1);
  };

  //const currentComments = filteredComments.slice((currentPageComments - 1) * pageSize, currentPageComments * pageSize);
  //const currentEvents = filteredEvents.slice((currentPageEvents - 1) * pageSize, currentPageEvents * pageSize);

  const showModal = () => {
    if (userInfo) {
      setEditName(userInfo.name);
      setEditImg(userInfo.imageURL);
      setShowImg(userInfo.imageURL);
      setIsModalVisible(true);
    }
  };

  const handleImageChange = (event) => {
    // console.log(event.target.value);
    let file = document.querySelector("input[type=file]").files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
      setShowImg(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setShowImg(null);
    }
    console.log(event.target.files);
    setEditImg(event.target.files[0]);
    console.log(editImg);
  };

  const handleOk = async () => {
    if (userInfo && editImg) {
      const userId = userInfo._id;
      console.log("edit image: ", editImg);

      // 使用 FormData 来包装文件数据
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("imageURL", editImg); // 'image' 是后端将要解析的字段名

      try {
        const response = await axios.patch(
          `http://localhost:4000/users/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // 确保设置正确的请求头
            },
          }
        );
        setUserInfo(response.data);
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMoveEvent = async (eventId) => {
    if(window.confirm("Are you sure to delete this event from your save list?")){
      try{
        const url = `http://localhost:4000/users/removeEventFromUser/${userInfo._id}/${eventId}`;
        const response = await axios.post(url);
        console.log(response);
        // 更新状态以反映变化
        setSavedEvents(newEvents => {
          const updatedEvents = newEvents.filter(event => event !== eventId);
          console.log("Updated events:", updatedEvents);
          return updatedEvents;
        });        
        console.log(response.data.message);
      }catch(error){
        console.error(error);
      }
    }
  } 

  return (
    <div className="user-profile-container">
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <img src={showImg ? showImg : noImage} loading="lazy" alt="logo" />

        <div>
          <label>
            <input
              id="imageURL"
              type="file"
              name="imageURL"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <br />
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Name"
        />
      </Modal>

      <div className="user-profile-sidebar">
        <div className="user-profile">
          <h2>{userInfo && userInfo.name}</h2>
          <p>{userInfo && userInfo.email}</p>
          <button onClick={showModal}>Edit Profile</button>
        </div>
      </div>

      <div className="user-profile-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Events" key="1">
            <Input placeholder="Search Events" onChange={handleSearchEvents} />
            <Grid
              container
              spacing={1}
              sx={{
                marginTop: "3%",
                marginBottom: "1%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                maxWidth: "auto",
                maxHeight: "auto",
                alignItems: "center",
                flexGrow: 1,
                flexBasis: 0,
                overflow: "auto",
              }}
            >
              {eventCardsData}
            </Grid>
           
            <Pagination
              current={currentPageEvents}
              total={filteredEvents.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPageEvents(page)}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Comments" key="2">
            <Input
              placeholder="Search Comments"
              onChange={handleSearchComments}
            />
            <Grid
              container
              spacing={1}
              sx={{
                marginTop: "3%",
                marginBottom: "1%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                maxWidth: "auto",
                maxHeight: "auto",
                alignItems: "center",
                flexGrow: 1,
                flexBasis: 0,
                overflow: "auto",
              }}
            >
              {postCardsData}
            </Grid>
            <Pagination
              current={currentPageComments}
              total={filteredComments.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPageComments(page)}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfile;
