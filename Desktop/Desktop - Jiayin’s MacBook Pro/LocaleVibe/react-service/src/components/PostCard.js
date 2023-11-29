import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/joy";
import "../App.css";
import axios from "axios";
import { Grid, Skeleton } from "@mui/material";
import noImage from "../images/no-image.png";

const apiKey = process.env.REACT_APP_EVENTBRITE_API_KEY;

// formate posts date
const formatDate = (datetime) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

function PostCard({ postId, onDelete }) {
  const [eventId, setEventId] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data = null;
    async function getPostById(id) {
      const url = `http://localhost:4000/post/detail/${id}`;
      try {
        const response = await axios.get(url);
        data = response.data;
        //console.log("postData", data);
        setPostData(data);
      } catch (error) {
        console.error("Error when get post detail", error);
        setPostData(undefined);
      }
    }
    getPostById(postId);
  }, [postId]);

  useEffect(() => {
    let data = null;
    async function getEventById(id) {
      const apiUrl = `https://www.eventbriteapi.com/v3/events/${id}/?token=${apiKey}`;
      try {
        const response = await axios.get(apiUrl);
        data = response.data;
        console.log(data);
        if (data) data.start.local = data.start.local.replace("T", " ");
        setEventData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error when get event detail", error);
        setEventData(undefined);
        setLoading(false);
      }
    }

    if (postData) {
      console.log("postData: ", postData);
      setEventId(postData.event_id);
      getEventById(postData.event_id);
    }
  }, [postData]);

  if (loading) {
    return (
      <Grid item xs={8} sm={8} md={5} lg={4} xl={3}>
        <Card className="event-by-date-card" sx={{ width: 320, height: 370 }}>
          <div>
            <Typography level="title-lg">
              <Skeleton sx={{ width: 290, height: 42, animation: "wave" }} />
            </Typography>
            <Typography level="body-sm">
              <Skeleton sx={{ width: 290, height: 18.4, animation: "wave" }} />
            </Typography>
            <IconButton
              aria-label="bookmark Bahamas Islands"
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
            >
              {/* <BookmarkAdd /> */}
            </IconButton>
          </div>
          <AspectRatio minHeight="120px" maxHeight="200px">
            <Skeleton sx={{ width: 290, height: 163, animation: "wave" }} />
          </AspectRatio>
          <CardContent orientation="horizontal">
            <div>
              <Typography level="body-xs">
                <a>
                  <Skeleton
                    sx={{ width: 202.85, height: 64, animation: "wave" }}
                  />
                </a>
              </Typography>
            </div>
            <Button
              variant="solid"
              size="md"
              // color="primary"
              aria-label="Explore Bahamas Islands"
              sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
              style={{ backgroundColor: "#6f48eb" }}
            >
              <a href="#" style={{ color: "white" }}>
                Explore
              </a>
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={8} sm={8} md={5} lg={4} xl={3}>
        <Card className="event-by-date-card" sx={{ width: 320, height: 370 }}>
          <div>
            {postData ? (
              <Typography level="title-lg">
                {postData && postData.title}
              </Typography>
            ) : (
              <Typography level="title-lg">
                This event has been canceled{" "}
              </Typography>
            )}

            {postData ? (
              <Typography level="body-sm">
                {formatDate(postData.datetime)}
              </Typography>
            ) : (
              <Typography level="title-lg">
                The date is no longer valid
              </Typography>
            )}

            <IconButton
              aria-label="bookmark Bahamas Islands"
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
            >
              {/* <BookmarkAdd /> */}
            </IconButton>
          </div>
          <AspectRatio minHeight="120px" maxHeight="200px">
            {eventData && eventData.logo ? (
              <img
                src={eventData.logo.original.url}
                loading="lazy"
                alt="logo"
              />
            ) : (
              <img src={noImage} loading="lazy" alt="no-image" />
            )}
          </AspectRatio>

          <CardContent orientation="horizontal">
            <div>
              {eventData ? (
                <Typography level="body-xs">
                  <a>{eventData && eventData.name.text}</a>
                </Typography>
              ) : (
                <a>No event information available</a>
              )}
            </div>
            {/* delete button */}
            {eventData ? (
              <Button
                variant="solid"
                size="md"
                color="danger"
                aria-label="Delete post"
                sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                onClick={onDelete}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="solid"
                size="md"
                color="danger"
                aria-label="Delete post"
                sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
              >
                Delete
              </Button>
            )}
            {eventData ? (
              <Button
                variant="solid"
                size="md"
                // color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                style={{ backgroundColor: "#6f48eb" }}
              >
                <a
                  href={`/events/${eventId}`}
                  style={{ color: "white" }}
                  target="_blank"
                >
                  Explore
                </a>
              </Button>
            ) : (
              <Button
                variant="solid"
                size="md"
                // color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                style={{ backgroundColor: "#6f48eb" }}
              >
                <a href={`#`} style={{ color: "white" }}>
                  Explore
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default PostCard;
