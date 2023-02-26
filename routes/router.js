import express from 'express'
import productRouter from './Product routes.js'
import unionRouter from './Union routes.js'
import userRouter from './User routes.js'

const router = express.Router();

router.get('/', (request, response) => response.redirect('/login.html')); 

router.use('/products', productRouter);
router.use('/unions', unionRouter);
router.use('/users', userRouter)

export default router;
