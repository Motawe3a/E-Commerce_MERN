import express from "express";
import { login, register } from "../services/userService";

const router = express.Router();

router.post("/register", async (_req, res) => {
    const result = await register({
        firstName: _req.body.firstName,
        lastName: _req.body.lastName,
        email: _req.body.email,
        password: _req.body.password
    });
    res.status(result.statusCode).send(result.data)
});

router.post("/login", async (_req, res) => {
    const result = await login({
        email: _req.body.email,
        password: _req.body.password
    });
    res.status(result.statusCode).send(result.data)
});



export default router;