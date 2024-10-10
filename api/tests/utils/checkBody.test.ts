import checkBody from "../../src/utils/checkbody";
import { jest, describe, it, expect } from "@jest/globals";

describe("checkBody", () => {
    it("devrait retourner true si tous les champs sont présents et valides", () => {
        const body = {
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String)
        };
        const keys = ["username", "email", "password"];

        const result = checkBody(body, keys);
        expect(result).toBe(true);
    });

    it("devrait retourner false si un champ est manquant", () => {
        const body = {
            username: expect.any(String),
            email: expect.any(String)
        };
        const keys = ["username", "email", "password"];

        const result = checkBody(body, keys);
        expect(result).toBe(false);
    });

    it("devrait retourner false si un champ est vide", () => {
        const body = {
            username: expect.any(String),
            email: expect.any(String),
            password: ""
        };
        const keys = ["username", "email", "password"];

        const result = checkBody(body, keys);
        expect(result).toBe(false);
    });

    it("devrait retourner false si un champ contient uniquement des espaces", () => {
        const body = {
            username: expect.any(String),
            email: "    ",
            password: expect.any(String)
        };
        const keys = ["username", "email", "password"];

        const result = checkBody(body, keys);
        expect(result).toBe(false);
    });

    it("devrait nettoyer les espaces en trop dans les champs et retourner true", () => {
        const body = {
            username: "    testuser    ", // Espaces en trop
            email: "   test@test.com  ",
            password: "  password123 "
        };
        const keys = ["username", "email", "password"];

        const result = checkBody(body, keys);
        expect(result).toBe(true);
    });
});
