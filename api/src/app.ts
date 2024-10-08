import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 1234;

app.listen(port, async () => {
	await mongoose.connect(`${process.env.DATABASE_URL}`);
	console.log(`App running on port ${port}`);
});
