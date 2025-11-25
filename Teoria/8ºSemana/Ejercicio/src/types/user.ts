 import { ObjectId } from "mongodb";
 
 export type User = {
  _id?: ObjectId;
  email: string;
  username: string;
  password: string;
};

 export type JwtPayload = {
  id: string;
  email : string;
};
