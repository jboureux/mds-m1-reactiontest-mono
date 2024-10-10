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
import { registerUser } from "../../../src/services/auth.service";
import User from "../../../src/models/user.models";

// Connexion à la base de données
beforeAll(async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}_test_users`, {});
});

// Nettoyage après chaque test
afterEach(async () => {
    await User.deleteMany({});
});

// Déconnexion après tous les tests
afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
});

function checkUserFields(expectedFields: Record<string, any>, actualUser: any) {
    for (const field in expectedFields) {
        expect(actualUser).toHaveProperty(field, expectedFields[field]);
    }
}

describe("registerUser tests", () => {
    it("devrait renvoyer une erreur si l'utilisateur existe déjà", async () => {
        const existingUser = new User({
            username: "testuser",
            email: "test@test.com",
            password: bcrypt.hashSync("password123", 10)
        });
        await existingUser.save();

        await expect(
            registerUser("newuser", "test@test.com", "password123")
        ).rejects.toThrow("User already exists");
    });

    it("devrait créer un nouvel utilisateur et renvoyer un token", async () => {
        const result = await registerUser(
            "newuser",
            "new@test.com",
            "password123"
        );

        const savedUser = await User.findOne({ email: "new@test.com" });
        expect(savedUser).toBeDefined();

        const isPasswordValid = bcrypt.compareSync(
            "password123",
            savedUser?.password!
        );
        expect(isPasswordValid).toBe(true);

        const expectedFields = {
            email: "new@test.com",
            username: "newuser",
            password: savedUser?.password
        };

        checkUserFields(expectedFields, savedUser);

        expect(result).toHaveProperty("token");
        const decoded = jwt.verify(
            result.token,
            process.env.JWT_SECRET || "secret"
        );
        expect(decoded).toHaveProperty("email", "new@test.com");
    });
});
