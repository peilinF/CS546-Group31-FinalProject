import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
} from "@mui/material";

const createPoll = async (eventID, poll) => {
  const newPoll = await axios.post(
    `http://localhost:4000/polls/event/${eventID}`,
    {
      org_id: "org_ID",
      title: poll.title,
      description: poll.description,
      options: poll.options,
    }
  );

  return newPoll;
};

export const PollForm = () => {
  let { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [option, setOption] = useState("");
  const [options, setOptions] = useState([]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  const handleAddOption = (event) => {
    event.preventDefault();
    setOptions([...options, option]);
    setOption("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title && description && options.length > 1) {
      const poll = {
        title: title,
        description: description,
        options: options,
      };

      const newPoll = await createPoll(id, poll);
      if (newPoll) {
        alert("New Poll Added!");
        setTitle("");
        setDescription("");
        setOptions([]);
      }
    } else {
      alert(
        "Make sure there are no empty fields and at least 2 options are added."
      );
    }
  };

  return (
    <Grid item>
      <Card sx={{ width: "auto" }} style={{ backgroundColor: "snow" }}>
        <br></br>
        <h1>Poll Form</h1>

        <CardContent style={{ textAlign: "left" }}>
          <form onSubmit={handleAddOption}>
            <label>
              Option:&nbsp;
              <input
                type="text"
                name="title"
                value={option || ""}
                onChange={handleOptionChange}
              />
            </label>
            <input type="submit" value="Add Option" />
          </form>

          <br></br>
          <h2>Options:</h2>
          {options.length > 0 ? (
            <ul>
              {options &&
                options.map((option) => {
                  return <li>&nbsp;&nbsp;&nbsp;&nbsp;- {option}</li>;
                })}
            </ul>
          ) : (
            <p>No options yet...</p>
          )}

          <br></br>
          <br></br>
          <h2>Details:</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Title:&nbsp;
              <input
                type="text"
                name="title"
                value={title || ""}
                onChange={handleTitleChange}
              />
            </label>

            <br></br>
            <br></br>
            <label>
              Description:&nbsp;
              <input
                type="text"
                name="description"
                value={description || ""}
                onChange={handleDescriptionChange}
              />
            </label>
            <input type="submit" />
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
};
