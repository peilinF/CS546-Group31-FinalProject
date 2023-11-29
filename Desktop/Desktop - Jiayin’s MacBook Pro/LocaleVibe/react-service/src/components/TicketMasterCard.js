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

function TicketMasterCard({ data }) {
  const eventData = {
    name: data.name,
    time: `${data.dates.start.localDate} ${data.dates.start.localTime}`,
    logo: data.images[0].url,
  };
  return (
    <Grid item xs={8} sm={8} md={5} lg={4} xl={3}>
      <Card className="event-by-date-card" sx={{ width: 320, height: 370 }}>
        <div>
          {eventData ? (
            <Typography level="title-lg">
              {eventData && eventData.name}
            </Typography>
          ) : (
            <Typography level="title-lg">
              This event has been canceled{" "}
            </Typography>
          )}
          {eventData ? (
            <Typography level="body-sm">{eventData.time}</Typography>
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
            <img src={eventData.logo} loading="lazy" alt="logo" />
          ) : (
            <img src={noImage} loading="lazy" alt="no-image" />
          )}
        </AspectRatio>
        <CardContent orientation="horizontal">
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
                href={`/event/ticketmaster/${data.id}`}
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

export default TicketMasterCard;
