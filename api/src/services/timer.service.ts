import mongoose from "mongoose";
import Timer from "../models/timer.models";

class TimerService {
    static async uploadTimer(timer: number, userId: mongoose.Types.ObjectId) {
        if (timer <= 0) {
            throw new Error("The timer can't be lower or equal to 0 !");
        }
        const newTimer = new Timer({ reactionTime: timer, user: userId });
        return await newTimer.save();
    }

    static async getUserTimers(userId: mongoose.Types.ObjectId) {
        return await Timer.find({ user: userId });
    }

    static async clearUserTimers(userId: mongoose.Types.ObjectId) {
        return await Timer.deleteMany({ user: userId });
    }
}

export default TimerService;
