/*
 * @Author: wangwendie
 * @Date: 2023-06-14 15:03:00
 * @LastEditors: wangwendie
 * @Description:
 */
import express from "express";
import Admin from "../controller/admin/admin"

const router = express.Router();

router.post("/register",Admin.register);
router.post("/update_avatar",Admin.updateAvatar);
router.post("/login", Admin.login);

router.get("/singout",Admin.singout);
router.get("/get_all_admin",Admin.getAllAdmin);
router.get("/get_admin_count",Admin.getAdminCount);
router.get("/get_admin_info",Admin.getAdminInfo);

export default router;