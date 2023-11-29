import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { PollForm } from "./PollForm";
import { PollCard } from "./PollCard";
import { Button, Grid } from "@mui/material";

import "../App.css";

const apiKey = process.env.REACT_APP_EVENTBRITE_API_KEY;
// const id = "692750504407";
// const id = "735668072007";

async function getEventById(id) {
  const apiUrl = `https://www.eventbriteapi.com/v3/events/${id}/`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error when get event detail", error);
    throw error;
  }
}

function EventDetail({}) {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [venue, setVenue] = useState({});
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth(); // 获取 Firebase Auth 的实例
  const [userInfo, setUserInfo] = useState(null); // 新状态来存储从你的后端获取的用户信息
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const eventId = id;

  const [create, setCreate] = useState(false);
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState(null);

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
          console.log(response.data);
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
    getEventById(eventId)
      .then((eventData) => {
        setEvent(eventData);
        if (
          eventData.logo &&
          eventData.logo.original.url &&
          document.getElementById("event-container")
        ) {
          document.getElementById(
            "event-container"
          ).style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 1.0), rgba(255, 255, 255, 0.7)), url('${eventData.logo.original.url}')`;
          document.getElementById(
            "event-container"
          ).style.backgroundAttachment = "fixed";
        }
        if (eventData.venue_id) {
          getVenueById(eventData.venue_id)
            .then(setVenue)
            .catch((error) => {
              console.error("Error fetching event", error);
              setError("There was a problem fetching event details.");
            });
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, [eventId]);

  useEffect(() => {
    async function getPolls() {
      setError(null);
      console.log("useEffect fired");

      try {
        const { data } = await axios.get(
          `http://localhost:4000/polls/event/${id}`
        );
        const results = data.polls;

        if (results && results.length > 0) setPolls(results);
      } catch (error) {
        console.log(error);
        setError("There was a problem fetching polls.");
      }
    }

    if (id) {
      getPolls();
    }
  }, [id, polls]);

  async function getVenueById(vid) {
    const apiUrl = `https://www.eventbriteapi.com/v3/venues/${vid}/`;
    setError(null);

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      setError("There was a problem fetching venue details.");
    }
  }

  function formatEventDateTime(start, end) {
    const startDate = new Date(start.local);
    const endDate = new Date(end.local);

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const startDateString = startDate.toLocaleDateString("en-US", dateOptions);

    // Function to format time
    const formatTime = (date) =>
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);

    const timeZone = start.timezone;

    return `${startDateString} · ${startTime} - ${endTime} ${timeZone}`;
  }

  function formatVenueAddress(venue) {
    let addressParts = [];
    if (venue.name) {
      addressParts.push(venue.name);
    }

    if (venue.address) {
      if (venue.address.address_1) {
        addressParts.push(venue.address.address_1);
      }
      if (venue.address.address_2) {
        addressParts.push(venue.address.address_2);
      }
      let cityRegionPostal = [];
      if (venue.address.city) {
        cityRegionPostal.push(venue.address.city);
      }
      if (venue.address.region) {
        cityRegionPostal.push(venue.address.region);
      }
      if (venue.address.postal_code) {
        cityRegionPostal.push(venue.address.postal_code);
      }
      if (cityRegionPostal.length > 0) {
        addressParts.push(cityRegionPostal.join(", "));
      }
    }
    return addressParts.join(" ");
  }

  useEffect(() => {
    postsForEvent(eventId)
      .then(async (posts) => {
        const postsWithUserInfo = await Promise.all(
          posts.map(async (post) => {
            const userInfo = await axios.get(
              `http://localhost:4000/users/${post.user_id}`
            );
            post.imageURL = userInfo.data.imageURL;
            console.log("displayPostForEvent userInfo: ", post);
            return post; // 将用户信息添加到帖子对象中
          })
        );
        setPosts(postsWithUserInfo);
      })
      .catch((error) => {
        console.error("Error fetching posts for event", error);
      });
  }, [eventId]);

  const postsForEvent = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/post/event/${id}`
      );
      if (response.data.error) {
        console.log(response.data);
        setError(response.data.error);
      } else {
        setError(null);
        return response.data;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }
  };

  // add post
  const handleAddPost = async () => {
    setError(null);
    if (!userInfo) {
      console.error("User must be logged in to add post");
      setError("You must be logged in to add a post");
      return;
    }
    try {
      const postData = {
        user_id: userInfo._id,
        imageURL: userInfo.imageURL,
        event_id: eventId,
        name: userInfo.name,
        title: newPostTitle,
        text: newPostContent,
      };

      const response = await axios.post(
        "http://localhost:4000/post/new",
        postData
      );

      const newPost = response.data;
      if (newPost.error) {
        console.log(newPost.error);
        setError(newPost.error);
      } else {
        setError(null);
        let updatedPosts = await postsForEvent(id);
        setPosts(updatedPosts);
        setNewPostTitle("");
        setNewPostContent("");
        return newPost;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }
  };

  // formate posts date
  const formatPostDate = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const [hasJoined, setHasJoined] = useState(false);
  useEffect(() => {
    if (userInfo && userInfo.events && userInfo.events.includes(eventId)) {
      setHasJoined(true);
    }
  }, [userInfo, eventId]);

  const joinEvent = async () => {
    setError(null);
    if (!userInfo) {
      console.error("User must be logged in to join event");
      setError("You must be logged in to join an event");
      return;
    }
    setHasJoined(true);
    setError(null);
    try {
      const response = await axios.post(
        `http://localhost:4000/users/addEventToUser/${userInfo._id}/${eventId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="outer-container">
      <div className="event-container" id="event-container">
        <img
          className="event-image"
          src={event.logo && event.logo.original.url}
          alt="Event Image"
        />
        <div className="event-details">
          <h1 className="event-name">{event.name && event.name.text}</h1>

          <div className="event-time-location">
            <CalendarMonthOutlinedIcon />
            <h2>Date and Time: </h2>
            {event.start &&
              event.end &&
              formatEventDateTime(event.start, event.end)}
            {/* <button className="join-button" onClick={joinEvent}>Join</button> */}
            <button
              className={hasJoined ? "join-button joined" : "join-button"}
              onClick={joinEvent}
              disabled={hasJoined}
            >
              {hasJoined ? "Joined" : "Join"}
            </button>
          </div>

          <div className="event-address">
            <LocationOnOutlinedIcon />
            <h2>Address:</h2>
            <div>
              {event.online_event ? "Online" : formatVenueAddress(venue)}
            </div>
          </div>

          <div className="event-description">
            <div className="description-header">
              <DescriptionOutlinedIcon />
              <h2>Description:</h2>
            </div>
            <div>{event.description && event.description.text}</div>
          </div>

          <p className="event-ticket">
            {event.is_externally_ticketed &&
            event.external_ticketing &&
            event.external_ticketing.external_url ? (
              <>
                If you want the tickets, click the link:
                <a
                  className="event-link"
                  href={event.external_ticketing.external_url}
                >
                  {event.external_ticketing.external_url}
                </a>
              </>
            ) : (
              "No external ticketing link available."
            )}
          </p>

          <div className="event-posts">
            <CommentOutlinedIcon />
            <h2>Posts:</h2>
          </div>
          {posts &&
            posts.map((post) => (
              <div className="post-container" key={post._id}>
                <div className="post-header">
                  <span className="post-title">{post.title}</span>
                  <span className="post-author">
                    {formatPostDate(post.datetime)} By: {post.name}
                    {post && post.imageURL && (
                      <div className="post-photo">
                        <img src={post.imageURL} alt="User Avatar" />
                      </div>
                    )}
                  </span>
                </div>
                <div className="post-content">{post.text}</div>
              </div>
            ))}
        </div>

        <div className="post-input-container">
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter post title"
                  />
                </td>
              </tr>
              <tr>
                <td>Content:</td>
                <td>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Enter post content"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleAddPost}>Add</button>
        </div>

        <br></br>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="add-poll-button"
          onClick={() => {
            if (!userInfo) {
              console.log("User must be logged in to create poll");
              setError("You must be logged in to create a poll");
              return;
            } else if (create) {
              setCreate(false);
            } else {
              setCreate(true);
            }
          }}
        >
          Create a new poll
        </button>
        <Grid
          container
          spacing={2}
          // direction="column"
          // alignItems="center"
          justifyContent="center"
          paddingTop="1%"
        >
          {create ? <PollForm /> : null}
        </Grid>

        <br></br>
        <h1>Polls:</h1>
        {polls && polls.length > 0 ? (
          <Grid
            container
            spacing={2}
            // alignItems="center"
            justifyContent="center"
            paddingTop="1%"
          >
            {userInfo ? (
              polls.map((poll) => {
                return (
                  <PollCard
                    pollData={poll}
                    userData={userInfo}
                    key={poll._id.toString()}
                  />
                );
              })
            ) : (
              <h2>Loading ...</h2>
            )}
          </Grid>
        ) : (
          <h2>No polls yet ...</h2>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
