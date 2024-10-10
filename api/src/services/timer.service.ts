import mongoose from "mongoose";
import Timer from "../models/timer.models";
import User from "../models/user.models";

class TimerService {
    static async uploadTimer(timer: number, userId: mongoose.Types.ObjectId) {
        if (timer <= 0) {
            throw new Error("The timer can't be lower or equal to 0 !");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error(
                "You can't submit a Timer for a non-existing user !"
            );
        }

        const newTimer = new Timer({ reactionTime: timer, user: userId });
        return await newTimer.save();
    }

    static async getUserTimers(userId: mongoose.Types.ObjectId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(
                "You can't get the Timers for a non-existing user !"
            );
        }

        return await Timer.find({ user: userId });
    }

    static async clearUserTimers(userId: mongoose.Types.ObjectId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(
                "You can't delete Timers for a non-existing user !"
            );
        }

        return await Timer.deleteMany({ user: userId });
    }
}

export default TimerService;
