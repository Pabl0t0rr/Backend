import { ObjectId } from "mongodb";

export type User = {
  _id: ObjectId;
  email: string;
  videoGameLibrary: string[]; //Los objectId guardan mas info que los strings
};