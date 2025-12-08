import { ObjectId } from "mongodb";

export type Projects  = {
  _id: ObjectId,
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  owner: string,
  members: string[],
  tasks: string[]
}