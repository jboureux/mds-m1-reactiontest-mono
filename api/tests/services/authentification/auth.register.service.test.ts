// tests/user.service.test.ts

import { registerUser } from "../../../src/services/auth.services";
import User from "../../../src/models/user.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { jest, describe, it, expect } from "@jest/globals";

// Mock des dépendances
jest.mock("../../../src/models/user.models");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("registerUser", () => {
    it("devrait renvoyer une erreur si l'utilisateur existe déjà", async () => {
        (
            User.findOne as jest.MockedFunction<typeof User.findOne>
        ).mockResolvedValue({ email: "test@test.com" });

        await expect(
            registerUser("username", "test@test.com", "password123"),
        ).rejects.toThrow("User already exists");
    });

    it("devrait créer un nouvel utilisateur et renvoyer un token", async () => {
        (
            User.findOne as jest.MockedFunction<typeof User.findOne>
        ).mockResolvedValue(null);

        (bcrypt.hashSync as jest.Mock).mockReturnValue("hashedPassword");

        const mockSavedUser = {
            id: "1",
            email: "test@test.com",
            username: "username",
            password: "hashedPassword",
            save: jest.fn(),
        };

        (User.prototype.save as jest.MockedFunction<any>).mockResolvedValue(
            mockSavedUser,
        );
        (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

        const result = await registerUser(
            "username",
            "test@test.com",
            "password123",
        );

        expect(result).toHaveProperty("token", "mockedToken");
        expect(result.savedUser.email).toBe("test@test.com");
        expect(result.savedUser.password).toBe("hashedPassword");
    });
});
