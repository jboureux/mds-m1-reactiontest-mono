import User from "../models/user.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_SECRET || "secret";

const generateToken = (id: string, email: string) => {
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

    savedUser.token = token;
    await savedUser.save();

    return { token, savedUser };
};

export { loginUser, registerUser };
