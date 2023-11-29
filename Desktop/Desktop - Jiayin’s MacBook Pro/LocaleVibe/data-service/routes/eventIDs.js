import express from "express";
import { spawn } from "child_process";

const router = express.Router();

function isEmpty(array) {
  return Array.isArray(array) && array[0] === undefined;
}

router.post("/", async (req, res) => {
  let responseSent = false;
  // get the request body
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
    const pages = data.pages;
    const date = data.date;
    const state = data.state;
    const city = data.city;

    const python = spawn("python3", [
      //"../data-service/data/EventIDCrawler.py",  // for local
      "data/EventIDCrawler.py", // for docker container
      pages,
      date,
      state,
      city,
    ]);

    let dataBuffer = [];

    python.stdout.on("data", (chunk) => {
      dataBuffer.push(chunk);
    });
  
    python.on('error', (error) => {
      console.error(`Error spawning Python process: ${error}`);
      return res.status(500).json({ error: "Internal server error during script execution" });
    });
  
    python.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      // Handle a 429 status in stderr if that's where it would be output
      if (data.includes("429")) {
        if (!responseSent) {
          responseSent = true;
          console.error("Rate limit hit, aborting");
          return res.status(429).json({ error: "Server is busy. Too many requests."});
        }
      }
    });

    python.on("close", (code) => {
      if (responseSent) return;
      const dataString = Buffer.concat(dataBuffer).toString();
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        try {
          const eventIDs = JSON.parse(dataString);
          if (isEmpty(eventIDs)) {
            return res.status(200).json({ message: "No events found for the selected date", eventIDs: [] });
          } else {
            return res.status(200).json({ eventIDs });
          }
        } catch (error) {
          if(!responseSent) {
            console.error("Error parsing JSON from Python script", error);
            res.status(500).json({ error: "Error parsing JSON from Python script", details: dataString });
            responseSent = true;
          }
        }
      }
    });
});

export default router;
