import express from "express";
import * as controllers from "../controllers/User controllers.js";

const router = express.Router();

router.get("/", controllers.getUsers);
router.get("/:search", controllers.searchUsers);
router.patch("/:id", controllers.updateUser);
router.delete("/:id", controllers.deleteUser);

export default router;
