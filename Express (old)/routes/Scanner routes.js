import express from "express"
import * as controllers from "../controllers/Scanner controller.js"

const router = express.Router();

router.get('/:barcode', controllers.barcodeSearch);

export default router;