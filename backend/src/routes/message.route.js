import { Router } from "express";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import { getMessages } from "../controllers/message.contoller.js";

const router = Router();

router.get("/get/:postId", validateUser, getMessages);

export default router;
