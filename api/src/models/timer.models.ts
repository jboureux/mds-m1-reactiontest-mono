import mongoose, { Document, Schema, Model, Collection } from "mongoose";

interface ITimer extends Document {
    reactionTime: Number;
    user: Collection;
}

const timerSchema: Schema<ITimer> = new mongoose.Schema({
    reactionTime: { type: Number },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const Timer: Model<ITimer> = mongoose.model<ITimer>("timer", timerSchema);

export default Timer;
