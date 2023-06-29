/*
 * @Author: wangwendie
 * @Date: 2023-06-29 17:43:23
 * @LastEditors: wangwendie
 * @Description:
 */
import express from "express";
import Captchas from '../controller/v1/captchas'


const router = express.Router();


router.post('/captchas', Captchas.getCaptchas);


export default router;