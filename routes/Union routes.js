import express from "express";
import * as controllers from "../controllers/Union controllers.js";
import verifyAuth from "../api/middleware/veryAuth.js";

const router = express.Router();

router.get("/", controllers.getUnions);
router.get("/:search", controllers.searchUnions);
router.post("/", verifyAuth, controllers.createUnion);
router.patch("/:id", verifyAuth, controllers.updateUnion);
router.delete("/:id", verifyAuth, controllers.deleteUnion);

export default router;
