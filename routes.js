import express from "express"
import * as controllers from "./controllers.js"

const router = express.Router();

router.get('/', controllers.getProducts);
router.get('/:search', controllers.searchProducts);
router.post('/', controllers.createProduct);
router.patch('/:upc', controllers.updateProduct);
router.delete('/:id', controllers.deleteProduct);

export default router;
