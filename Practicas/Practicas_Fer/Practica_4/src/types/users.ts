import { ObjectId } from "mongodb";

export type User = {
  _id: ObjectId,
  username: string,
  email: string,
  password: string,
  createdAt: Date,
};