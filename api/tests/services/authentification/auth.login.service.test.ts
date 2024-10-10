import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    afterEach
} from "@jest/globals";
import { loginUser } from "../../../src/services/auth.service";
import User from "../../../src/models/user.models";

beforeAll(async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}_test_users`, {});
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
});

describe("loginUser tests", () => {
    it("devrait renvoyer une erreur si l'utilisateur n'est pas trouvé", async () => {
        await expect(loginUser("test@test.com", "password123")).rejects.toThrow(
            "Invalid credentials"
        );
    });

    it("devrait renvoyer une erreur si le mot de passe est incorrect", async () => {
        const existingUser = new User({
            username: "testuser",
            email: "test@test.com",
            password: bcrypt.hashSync("correctpassword", 10)
        });
        await existingUser.save();

        await expect(
            loginUser("test@test.com", "wrongpassword")
        ).rejects.toThrow("Invalid credentials");
    });

    it("devrait renvoyer un token si les identifiants sont corrects", async () => {
        const existingUser = new User({
            username: "testuser",
            email: "test@test.com",
            password: bcrypt.hashSync("password123", 10)
        });
        await existingUser.save();

        const result = await loginUser("test@test.com", "password123");

        expect(result).toHaveProperty("token");
        const decoded = jwt.verify(
            result.token,
            process.env.JWT_SECRET || "secret"
        );
        expect(decoded).toHaveProperty("email", "test@test.com");
    });
});
