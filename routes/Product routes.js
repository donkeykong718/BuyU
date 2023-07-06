import express from "express";
import * as controllers from "../controllers/Product controllers.js";
import verifyAuth from "../api/middleware/veryAuth.js";

const router = express.Router();

router.get("/", controllers.getProducts);
router.get("/:search", controllers.searchProducts);
router.post("/", verifyAuth, controllers.createProduct);
router.patch("/:id", verifyAuth, controllers.updateProduct);
router.delete("/:id", verifyAuth, controllers.deleteProduct);

// router.get('/scanner/', controllers.scanBarcode);

export default router;
