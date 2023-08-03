import { Router } from "express";
import usersRouter from "./users.router.js";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import viewsRouter from "./views.router.js";

const router = Router();

router.use('/',viewsRouter);
router.use('/api', usersRouter);
router.use('/api/carts',cartsRouter);
router.use('/api/products',productsRouter);

export default router;