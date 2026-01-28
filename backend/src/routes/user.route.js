import {
  changePassword,
  changeMetaData,
  addInterests,
  updateAvatar,
  getUser,
} from "../controllers/user.controller.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import express from "express";
import upload from "../utils/multer.util.js";

const router = express.Router();

router.post("/update/password", validateUser, changePassword);
router.post("/update/profile", validateUser, changeMetaData);
router.post("/add/interests", validateUser, addInterests);
router.post(
  "/update/avatar",
  validateUser,
  upload.single("avatar"),
  updateAvatar,
);
router.get("/me", validateUser, getUser);

export default router;
