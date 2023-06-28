/*
 * @Author: wangwendie
 * @Date: 2023-06-15 19:30:55
 * @LastEditors: wangwendie
 * @Description:
 */
import admin from "./admin.js";
import shopping from "./shopping.js";

export default (app) => {
  app.use(admin);
  app.use(shopping);
}