/*
 * @Author: wangwendie
 * @Date: 2023-06-27 15:11:16
 * @LastEditors: wangwendie
 * @Description:
 */
import Shop from "../controller/shopping/shop";
import Check from '../middlewares/check'
import express from "express";


const router = express.Router();
// router.post("地址", 中间件函数, 方法);
router.post("/add_shop", Check.checkAdmin, Shop.addShop);


export default router;
