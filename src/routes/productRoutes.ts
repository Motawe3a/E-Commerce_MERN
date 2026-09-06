import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from "../services/productService";
import { asyncHandler } from "../middlewares/errorHandler";
import { requireAdmin, validateJWT } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", asyncHandler(async (_req, res) => {
    const result = await getAllProducts();
    res.status(result.statusCode).send(result.data);
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const result = await getProductById(String(req.params.id));
    res.status(result.statusCode).send(result.data);
}));

router.post("/", validateJWT, requireAdmin, asyncHandler(async (req, res) => {
    const result = await createProduct(req.body);
    res.status(result.statusCode).send(result.data);
}));

router.put("/:id", validateJWT, requireAdmin, asyncHandler(async (req, res) => {
    const result = await updateProduct(String(req.params.id), req.body);
    res.status(result.statusCode).send(result.data);
}));

router.delete("/:id", validateJWT, requireAdmin, asyncHandler(async (req, res) => {
    const result = await deleteProduct(String(req.params.id));
    res.status(result.statusCode).send(result.data);
}));

export default router;
