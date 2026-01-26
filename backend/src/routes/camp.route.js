import { Router } from "express";

import {
  createCamp,
  trendingCamps,
  topCamps,
  personalisedCamps,
  joinCamp,
  myCamps,
} from "../controllers/camp.controller.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";

const router = Router();

router.post("/create", validateUser, createCamp);
router.post("/join/:id", validateUser, joinCamp);
router.get("/get", validateUser, personalisedCamps);
router.get("/trending", validateUser, trendingCamps);
router.get("/top", validateUser, topCamps);
router.get("/my-camps", validateUser, myCamps);

export default router;
