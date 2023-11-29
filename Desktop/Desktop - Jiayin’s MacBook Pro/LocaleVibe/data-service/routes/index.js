import users from "./users.js";
import postRoute from "./posts.js";
import eventIDs from "./eventIDs.js";
import geo from "./geolocation.js";
import polls from "./polls.js";

const constructorMethod = (app) => {
  app.use("/users", users);
  app.use("/post", postRoute);
  app.use("/eventIDs", eventIDs);
  app.use("/geo", geo);
  app.use("/polls", polls);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
