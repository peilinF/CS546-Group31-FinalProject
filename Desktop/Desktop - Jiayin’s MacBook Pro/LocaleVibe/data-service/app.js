import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import cors from "cors";

// app.set("view engine", "ejs");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // 这里需要替换为您的前端应用的 URL
    credentials: true, // 允许跨域请求设置 cookie
  })
);

app.use(
  session({
    name: "AwesomeWebApp",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// __dirname在ES Modules中不可用，使用以下方式获取
const __dirname = dirname(fileURLToPath(import.meta.url));

// 假设你的图片存储在项目根目录下的 'public' 文件夹中
const publicPath = join(__dirname, 'public');
//const publicPath = fileURLToPath('/public')

// 将public文件夹设置为静态资源目录
app.use('/public', express.static(publicPath));


configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:4000");
});
