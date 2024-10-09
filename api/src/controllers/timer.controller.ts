import express from "express";
import mongoose from "mongoose";
import TimerService from "../services/timer.service";

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

    //check authentication and get userId

    try {
        const timer = await TimerService.uploadTimer(
            reactionTime,
            new mongoose.Types.ObjectId("67066e20c0db3a6728fa99c6"),
        );
        res.status(201).send(timer);
    } catch (e) {
        res.status(400).send({ status: 400, error: (e as Error).message });
    }
});
router.get("/me", async (req, res) => {
    //check auth and get UserID
    try {
        const timers = await TimerService.getUserTimers(
            new mongoose.Types.ObjectId("67066e20c0db3a6728fa99c6"),
        );

        res.status(200).send(timers);
    } catch (e) {
        res.status(400).send({ status: 400, error: (e as Error).message });
    }
});
router.delete("/clear", async (req, res) => {
    //check auth and get UserID
    try {
        const timers = await TimerService.clearUserTimers(
            new mongoose.Types.ObjectId("67066e20c0db3a6728fa99c6"),
        );

        res.status(200).send(timers);
    } catch (e) {
        res.status(400).send({ status: 400, error: (e as Error).message });
    }
});

export const TimerRouter = router;
