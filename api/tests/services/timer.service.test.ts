import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    jest,
    test,
} from "@jest/globals";
import { randomInt } from "crypto";
import mongoose from "mongoose";
import Timer from "../../src/models/timer.models";
import TimerService from "../../src/services/timer.service";

let userId: mongoose.Types.ObjectId;

beforeAll(async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}_tests_timer`);
    userId = new mongoose.Types.ObjectId();
});

afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
});

describe("uploadTimer tests...", () => {
    afterEach(async () => {
        await Timer.deleteMany({});
    });
    test("a Timer object should be present in database after saving a new Timer", async () => {
        const reactionTime = randomInt(25);
        await TimerService.uploadTimer(reactionTime, userId);

        const uploadedTimer = await Timer.findOne({
            reactionTime: reactionTime,
            user: userId,
        });

        expect(uploadedTimer).toBeDefined();
        expect(uploadedTimer?.reactionTime).toBe(reactionTime);
    });
    test("uploadTimer should throw an error when trying to create a Timer for a non-existing user", async () => {});
    test("uploadTimer should throw an error when trying to create a Timer with a negative reactionTime", async () => {
        await expect(TimerService.uploadTimer(-12, userId)).rejects.toThrow(
            "The timer can't be lower or equal to 0 !",
        );
    });
});

describe("getUserTimers tests...", () => {
    test("getUserTimers should return an empty array if the User has no uploaded Timer", async () => {});
    test("getUserTimers should return 1 timer after uploading one", async () => {});
    test("getUserTimers should throw an error when trying to get the timers for a non-existing user", async () => {});
});

describe("clearUserTimers tests...", () => {
    test("clearUserTimers should return an object {acknowledged: true, deletedCount: n} after deleting the timers a user has", async () => {});
    test("clearUserTimers should throw an error when trying to delete the timers for a non-existing user", async () => {});
});
