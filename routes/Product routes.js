import express from "express";
import * as controllers from "../controllers/Product controllers.js";
import verifyAuth from "../api/middleware/veryAuth.js";

const router = express.Router();

router.get("/", controllers.getProducts);
router.get("/:search", controllers.searchProducts);
router.post("/", controllers.createProduct);
router.patch("/:id", controllers.updateProduct);
router.delete("/:id", controllers.deleteProduct);

// router.get('/scanner/', controllers.scanBarcode);

export default router;
