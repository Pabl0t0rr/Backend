import { ObjectId } from "mongodb";

export type VideoGame = {
  _id?: ObjectId,
  name: string;
  platform: string;
  date: Date;
};
