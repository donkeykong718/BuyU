import express from "express";
import * as controllers from "../controllers/Auth_controllers.js";

const router = express.Router();

router.post("/signup", controllers.createUser);
router.post("/signin", controllers.userLogin);

export default router;
