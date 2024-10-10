import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models";

const generateToken = (id: string, email: string) => {
    const jwtKey = process.env.JWT_SECRET || "secret";
    return jwt.sign({ id, email }, jwtKey, {
        expiresIn: "30m",
    });
};

const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const token = generateToken(user.id.toString(), user.email);

    return { token };
};

const registerUser = async (
    username: string,
    email: string,
    password: string,
) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const newUser = new User({
        username,
        email,
        password: bcrypt.hashSync(password, 10),
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser.id.toString(), savedUser.email);

    return { token, savedUser };
};

export { loginUser, registerUser };
