import express from "express";
import {
    addItemToCart,
    clearCart,
    getActiveCart,
    removeItemFromCart,
    updateItemInCart
} from "../services/cartService";
import { asyncHandler } from "../middlewares/errorHandler";
import { validateJWT } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(validateJWT);

router.get("/", asyncHandler(async (req, res) => {
    const result = await getActiveCart({ userId: req.user!.id });
    res.status(result.statusCode).send(result.data);
}));

router.post("/items", asyncHandler(async (req, res) => {
    const result = await addItemToCart({
        userId: req.user!.id,
        productId: req.body.productId,
        quantity: req.body.quantity
    });
    res.status(result.statusCode).send(result.data);
}));

router.put("/items/:productId", asyncHandler(async (req, res) => {
    const result = await updateItemInCart({
        userId: req.user!.id,
        productId: String(req.params.productId),
        quantity: req.body.quantity
    });
    res.status(result.statusCode).send(result.data);
}));

router.delete("/items/:productId", asyncHandler(async (req, res) => {
    const result = await removeItemFromCart({
        userId: req.user!.id,
        productId: String(req.params.productId)
    });
    res.status(result.statusCode).send(result.data);
}));

router.delete("/", asyncHandler(async (req, res) => {
    const result = await clearCart({ userId: req.user!.id });
    res.status(result.statusCode).send(result.data);
}));

export default router;
