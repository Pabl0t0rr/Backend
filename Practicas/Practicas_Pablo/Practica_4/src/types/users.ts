import { ObjectId } from "mongodb";

export type User = {
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  createdAt: Date,
};