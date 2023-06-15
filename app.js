/*
 * @Author: wangwendie
 * @Date: 2023-06-14 10:43:55
 * @LastEditors: wangwendie
 * @Description:
 */
import express from "express";
import router from "./routes/index.js";
import chalk from 'chalk';
import db from './mongodb/db.js'; //引入了，在进行db的连接

const app = express();

// 使用配置
const config = require("config-lite")("./config");

// 給route路由送去app参数对象
router(app);
db(config);
// 安排请求头
app.all("*",(req, res, next)=>{
  const { origin, Origin, referer, Referer} = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || "*";
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method == 'OPTIONS') {
  	res.sendStatus(200);
	} else {
    next();
	}
})

app.get("/",(req, res, next)=>{
  res.send("first run Node");
})

app.listen(config.port,()=>{
  console.log(
    chalk.blue(`${config.port}端口：监听打开了`)
  );
})

