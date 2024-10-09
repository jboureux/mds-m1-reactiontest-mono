import mongoose from "mongoose";
import Timer from "../models/timer.models";

export async function uploadTimer(
    timer: number,
    userId: mongoose.Schema.Types.ObjectId,
) {
    if (timer <= 0) {
        throw new Error("The timer can't be lower or equal to 0 !");
    }
    const newTimer = new Timer({ reactionTime: timer, user: userId });
    return await newTimer.save();
}

export async function getUserTimers(userId: mongoose.Schema.Types.ObjectId) {
    return await Timer.find({ user: userId });
}

export async function clearUserTimers(userId: mongoose.Schema.Types.ObjectId) {
    return await Timer.deleteMany({ user: userId });
}
