import { ObjectId } from "mongodb";

export type Coche = {
    _id?: string;
    id : string;
    brand: string;
    model: string;
    year: number;
    price: number;
};

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

