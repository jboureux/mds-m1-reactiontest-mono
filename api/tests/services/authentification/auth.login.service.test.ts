
import { loginUser } from "../../../src/services/auth.services";
import User, { IUser } from "../../../src/models/user.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {jest , describe ,it ,expect}from "@jest/globals"


jest.mock("../../../src/models/user.models");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("loginUser", () => {
  it("devrait renvoyer une erreur si l'utilisateur n'est pas trouvé", async () => {
   
    (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(null);
    await expect(loginUser("test@test.com", "password123")).rejects.toThrow("Invalid credentials");
  });

  it("devrait renvoyer une erreur si le mot de passe est incorrect", async () => {
    const mockUser = { password: bcrypt.hashSync("wrongpassword", 10) } as IUser;
    (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(mockUser); 
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false); 

    await expect(loginUser("test@test.com", "password123")).rejects.toThrow("Invalid credentials");
  });

  it("devrait renvoyer un token si les identifiants sont corrects", async () => {
    const mockUser = { id: "1", email: "test@test.com", password: bcrypt.hashSync("password123", 10) } as IUser;
    (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true); 
    (jwt.sign as jest.Mock).mockReturnValue("mockedToken"); 

    const result = await loginUser("test@test.com", "password123");
    expect(result).toHaveProperty("token", "mockedToken");
  });
});
