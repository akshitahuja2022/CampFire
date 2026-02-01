import { Router } from "express";

import {
  createCamp,
  trendingCamps,
  topCamps,
  personalisedCamps,
  joinCamp,
  leaveCamp,
  myCamps,
} from "../controllers/camp.controller.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { campSchema } from "../utils/validate.util.js";

const router = Router();

router.post("/create", validateUser, validate(campSchema), createCamp);
router.post("/join/:id", validateUser, joinCamp);
router.post("/leave/:id", validateUser, leaveCamp);
router.get("/get", validateUser, personalisedCamps);
router.get("/trending", validateUser, trendingCamps);
router.get("/top", validateUser, topCamps);
router.get("/my-camps", validateUser, myCamps);

export default router;
