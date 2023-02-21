import express from "express"
import * as controllers from "./controllers.js"

const router = express.Router();

router.get('/', controllers.getProducts);
router.get('/:upc', controllers.searchProducts);
router.post('/', controllers.createProduct);
router.patch('/:upc', controllers.updateProduct);
router.delete('/:upc', controllers.deleteProduct);

export default router;
