import { beforeAll, describe, jest, test } from "@jest/globals";
import Timer from "../../src/models/timer.models";
import { uploadTimer } from "../../src/services/timer.service";
import mongoose, { Mongoose } from "mongoose";
import User from "../../src/models/user.models";

describe("uploadTimer tests...", () => {
    test("a Timer object should be present in database after saving a new Timer", async () => {});
    test("uploadTimer should throw an error when trying to create a Timer for a non-existing user", async () => {});
    test("uploadTimer should throw an error when trying to create a Timer with a negative reactionTime", async () => {});
});

describe("getUserTimers tests...", () => {
    test("getUserTimers should return an empty array if the User has no uploaded Timer", async () => {});
    test("getUserTimers should return 1 timer after uploading one", async () => {});
    test("getUserTimers should throw an error when trying to get the timers for a non-existing user", async () => {});
});

describe("clearUserTimers tests...", () => {
    test("clearUserTimers should return an empty array after deleting the timers a user has", async () => {});
    test("clearUserTimers should throw an error when trying to delete the timers for a non-existing user", async () => {});
});
