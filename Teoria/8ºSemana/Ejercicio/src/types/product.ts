import { ObjectId } from "mongodb"; 
 
export type Product = {
  _id?: ObjectId;
  idCreatorUser:string; //Le pasaremos el id del user creador
  idsBuyer: string[]; //Le pasaremos el id de los users
  name: string;
  description: string;
  createdAt?: Date; //Para ver si funcionaba (No obligatorio)
  updatedAt?: Date;
  updatedBuyAt?: Date;
};