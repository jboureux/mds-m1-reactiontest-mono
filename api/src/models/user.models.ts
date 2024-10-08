import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  Token?: string;
}
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Token: { type: String },
});


const User: Model<IUser> = mongoose.model<IUser>('user', userSchema);

export default User;