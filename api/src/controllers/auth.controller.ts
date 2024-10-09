import express from "express";
import checkBody from "../utils/checkbody";
import { loginUser, registerUser } from "../services/auth.service";

const Router = express.Router();

Router.post("/login", async (req, res) => {
    const requiredBody = ["email", "password"];
    const { email, password } = req.body;

    if (!checkBody(req.body, requiredBody)) {
        res.status(400).json({
            result: false,
            error: "Missing or empty field",
        });
        return;
    }
    try {
        const { token } = await loginUser(email, password);
        res.status(200).json({ result: true, token });
    } catch (error) {
        res.status(401).json({ result: false, message: "server error" });
    }
});

Router.post("/register", async (req, res) => {
    const requiredBody = ["email", "password", "username"];
    const { email, password, username } = req.body;

    if (!checkBody(req.body, requiredBody)) {
        res.status(400).json({
            result: false,
            error: "Missing or empty field",
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        res.json({ result: false, error: "Invalid email format" });
    }

    try {
        const { token, savedUser } = await registerUser(
            username,
            email,
            password,
        );
        res.status(201).json({ result: true, token, user: savedUser });
    } catch (error) {
        res.status(400).json({ result: false, error: "server error" });
    }
});

export default Router;
