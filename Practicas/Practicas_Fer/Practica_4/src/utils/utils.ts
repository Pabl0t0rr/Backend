//Imports basicos
import dotenv from "dotenv"
dotenv.config();

//DB name
export const dbName = process.env.DB_NAME as string;
//Colecctions
export const userCollection = process.env.COLLECTION_NAME_U as string;
export const postCollection = process.env.COLLECTION_NAME_P as string;

