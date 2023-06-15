/*
 * @Author: wangwendie
 * @Date: 2023-06-14 15:03:00
 * @LastEditors: wangwendie
 * @Description:
 */
import express from "express";
import Admin from "../controller/admin/admin"

const router = express.Router();

router.get('/login', Admin.login );

export default router;