import express from "express";
import { checkout, getMyOrders, getOrderById } from "../services/orderService";
import { asyncHandler } from "../middlewares/errorHandler";
import { validateJWT } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(validateJWT);

router.post("/checkout", asyncHandler(async (req, res) => {
    const result = await checkout({ userId: req.user!.id, address: req.body.address });
    res.status(result.statusCode).send(result.data);
}));

router.get("/", asyncHandler(async (req, res) => {
    const result = await getMyOrders({ userId: req.user!.id });
    res.status(result.statusCode).send(result.data);
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const result = await getOrderById({ userId: req.user!.id, orderId: String(req.params.id) });
    res.status(result.statusCode).send(result.data);
}));

export default router;
