import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { TimerRouter } from "../controllers/timer.controller";

dotenv.config();

import usersRouter from './controllers/auth.controler';
import timerRouter from './controllers/auth.controler';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/timer', timerRouter);
app.use('/users', usersRouter);

const port = 1234;

app.use("/timer", TimerRouter);

app.listen(port, async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log(`App running on port ${port}`);
});
