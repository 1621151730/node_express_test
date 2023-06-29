import express from "express";
import User from "../controller/v2/user";


const router = express.Router();


router.post('/user/login', User.login);
router.post("/user/sign_in", User.signIn);

export default router;