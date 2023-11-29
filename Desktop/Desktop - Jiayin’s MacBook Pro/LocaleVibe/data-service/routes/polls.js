import { Router } from "express";
import { pollData } from "../data/index.js";

const router = Router();

router
  .route("/:id")
  .get(async (req, res) => {
    const pollID = req.params.id;
    if (!pollID) {
      return res.status(400).json("error", { error: "Empty id." });
    }
    try {
      let data = await pollData.get(pollID);
      res.status(200).json(data);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const pollID = req.params.id;
    if (!pollID) {
      return res.status(400).json("error", { error: "Empty id." });
    }
    // get the request body
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    if (!data.userID) {
      return res
        .status(400)
        .json({ error: "There are no userID in the request body" });
    }

    try {
      const { userID, option } = data;
      const poll = await pollData.vote(pollID, userID, option);
      res.status(200).json(poll);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

router
  .route("/event/:eventId")
  .get(async (req, res) => {
    const eventID = req.params.eventId;

    if (!eventID) {
      return res.status(400).json({ error: "Empty id." });
    }
    try {
      let polls = await pollData.getByEventId(eventID);

      return res.status(200).json({ polls });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const eventID = req.params.eventId;
    if (!eventID) {
      return res.status(400).json({ error: "Empty id." });
    }
    // get the request body
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      const { org_id, title, description, options } = data;
      const newPoll = await pollData.create(
        eventID,
        org_id,
        title,
        description,
        options
      );
      res.status(200).json(newPoll);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

export default router;
