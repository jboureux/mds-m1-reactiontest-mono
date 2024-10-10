import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test
} from "@jest/globals";
import { randomInt } from "crypto";
import mongoose from "mongoose";
import Timer from "../../src/models/timer.models";
import User from "../../src/models/user.models";
import TimerService from "../../src/services/timer.service";

let userId: mongoose.Types.ObjectId;

beforeAll(async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}_tests_timer`);
    const user = new User({
        username: "Test",
        email: "test@test.test",
        password: "test"
    });
    await user.save();
    userId = user._id as mongoose.Types.ObjectId;
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
            user: userId
        });

        expect(uploadedTimer).toBeDefined();
        expect(uploadedTimer?.reactionTime).toBe(reactionTime);
    });
    test("uploadTimer should throw an error when trying to create a Timer for a non-existing user", async () => {
        await expect(
            TimerService.uploadTimer(
                12,
                new mongoose.Types.ObjectId("123456789012345678901234")
            )
        ).rejects.toThrow("You can't submit a Timer for a non-existing user !");
    });
    test("uploadTimer should throw an error when trying to create a Timer with a negative reactionTime", async () => {
        await expect(TimerService.uploadTimer(-12, userId)).rejects.toThrow(
            "The timer can't be lower or equal to 0 !"
        );
    });
});

describe("getUserTimers tests...", () => {
    afterEach(async () => {
        await Timer.deleteMany({});
    });
    test("getUserTimers should return an empty array if the User has no uploaded Timer", async () => {
        const timers = await TimerService.getUserTimers(userId);

        expect(timers.length).toBe(0);
    });
    test("getUserTimers should return 1 timer after uploading one", async () => {
        const reactionTime = randomInt(25);
        await Timer.create({ reactionTime: reactionTime, user: userId });

        const timers = await TimerService.getUserTimers(userId);

        expect(timers.length).toBe(1);
        expect(timers[0].reactionTime).toBe(reactionTime);
        expect(timers[0].user).toStrictEqual(userId);
    });
    test("getUserTimers should throw an error when trying to get the timers for a non-existing user", async () => {
        await expect(
            TimerService.getUserTimers(
                new mongoose.Types.ObjectId("123456789012345678901234")
            )
        ).rejects.toThrow("You can't get the Timers for a non-existing user !");
    });
});

describe("clearUserTimers tests...", () => {
    test("clearUserTimers should return an object {acknowledged: true, deletedCount: n} after deleting the timers a user has", async () => {
        const reactionTime = randomInt(25);
        await Timer.create({ reactionTime: reactionTime, user: userId });

        const response = await TimerService.clearUserTimers(userId);

        expect(response.acknowledged).toBe(true);
        expect(response.deletedCount).toBe(1);
    });
    test("clearUserTimers should throw an error when trying to delete the timers for a non-existing user", async () => {
        await expect(
            TimerService.clearUserTimers(
                new mongoose.Types.ObjectId("123456789012345678901234")
            )
        ).rejects.toThrow("You can't delete Timers for a non-existing user !");
    });
});
