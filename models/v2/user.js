/*
 * @Author: wangwendie
 * @Date: 2023-06-29 16:53:39
 * @LastEditors: wangwendie
 * @Description: 用户的信息
 */
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: Number,
  username: String,
  password: String,
})

const User = mongoose.model("User", UserSchema);

export default User;