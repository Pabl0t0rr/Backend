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

 export type Product = {
  _id?: ObjectId;
  idCreatorUser:string; //Le pasaremos el id del user creador
  idsBuyer: string[]; //Le pasaremos el id de los users
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  updatedBuyAt?: Date;
};