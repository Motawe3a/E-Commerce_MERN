import express from "express";
import { login, register } from "../services/userService";
import { asyncHandler } from "../middlewares/errorHandler";

const router = express.Router();

router.post("/register", asyncHandler(async (req, res) => {
    const result = await register({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    res.status(result.statusCode).send(result.data);
}));

router.post("/login", asyncHandler(async (req, res) => {
    const result = await login({
        email: req.body.email,
        password: req.body.password
    });
    res.status(result.statusCode).send(result.data);
}));

export default router;
