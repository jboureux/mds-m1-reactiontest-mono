import express from "express";
import mongoose from "mongoose";
import TimerService from "../services/timer.service";
import { validateToken } from "../utils/checktoken";

const router = express.Router();

router.post("/submit", async (req, res) => {
    const { reactionTime } = req.body;

    if (reactionTime === undefined) {
        res.status(400).send({
            status: 400,
            error: "You should provide a 'reactionTime' in the request body",
        });
        return;
    }

    if (!req.headers.authorization) {
        res.status(401).send({
            status: 401,
            error: "You need to be authenticated",
        });
        return;
    }
    const bearerToken = req.headers.authorization;
    const decodedToken = validateToken(bearerToken.replace(/Bearer\ /, ""));

    if (!decodedToken.valid) {
        res.status(401).send({
            status: 401,
            error: `Authentication error: ${decodedToken.error}`,
        });
        return;
    }

    try {
        const timer = await TimerService.uploadTimer(
            reactionTime,
            new mongoose.Types.ObjectId(decodedToken.decoded?.id),
        );
        res.status(201).send(timer);
    } catch (e) {
        res.status(400).send({ status: 400, error: (e as Error).message });
    }
});

router.get("/me", async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send({
            status: 401,
            error: "You need to be authenticated",
        });
        return;
    }

    const bearerToken = req.headers.authorization;
    const decodedToken = validateToken(bearerToken.replace(/Bearer\ /, ""));

    if (!decodedToken.valid) {
        res.status(401).send({
            status: 401,
            error: `Authentication error: ${decodedToken.error}`,
        });
        return;
    }

    try {
        const timers = await TimerService.getUserTimers(
            new mongoose.Types.ObjectId(decodedToken.decoded?.id),
        );

        res.status(200).send(timers);
    } catch (e) {
        res.status(400).send({ status: 400, error: (e as Error).message });
    }
});

router.delete("/clear", async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send({
            status: 401,
            error: "You need to be authenticated",
        });
        return;
    }

    const bearerToken = req.headers.authorization;
    const decodedToken = validateToken(bearerToken.replace(/Bearer\ /, ""));

    if (!decodedToken.valid) {
        res.status(401).send({
            status: 401,
            error: `Authentication error: ${decodedToken.error}`,
        });
        return;
    }

    try {
        const timers = await TimerService.clearUserTimers(
            new mongoose.Types.ObjectId(decodedToken.decoded?.id),
        );

        res.status(200).send(timers);
    } catch (e) {
        res.status(400).send({ status: 400, error: (e as Error).message });
    }
});

export const TimerRouter = router;
