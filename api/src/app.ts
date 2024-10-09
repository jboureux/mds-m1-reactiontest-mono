import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import usersRouter from "./controllers/auth.controller";
import { TimerRouter } from "./controllers/timer.controller";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", usersRouter);
app.use("/timer", TimerRouter);

const port = 1234;

app.listen(port, async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log(`App running on port ${port}`);
});
