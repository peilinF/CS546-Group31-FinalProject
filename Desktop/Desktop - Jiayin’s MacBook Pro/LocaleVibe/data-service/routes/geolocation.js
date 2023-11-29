import express from "express";
import axios from "axios";
import xml2js from "xml2js";
import { promisify } from "util";

const router = express.Router();

router.route("/").get(async (req, res) => {
  async function fetchData() {
    try {
      let result = null;
      let { data } = await axios.get(
        `https://api.3geonames.org/${req.query.latitude},${req.query.longitude}`,
        {
          headers: {
            withCredentials: "false",
          },
        }
      );

      const parser = new xml2js.Parser();

      if (data) {
        result = await promisify(parser.parseString)(data);
        res.send(result);
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchData();
});

export default router;
