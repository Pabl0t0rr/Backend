//Import environment variables
import dotenv from "dotenv";
dotenv.config();

//Port
export const port = Number(process.env.PORT_G);
//BD name
export const dbName = process.env.DB_NAME as string;

//Collections
export const studentCollection = process.env.COLLECTION_NAME_S as string;
export const courseCollection = process.env.COLLECTION_NAME_C as string;
export const reviewCollection = process.env.COLLECTION_NAME_R as string;
export const organicerCollection = process.env.COLLECTION_NAME_O as string;

//Secret
export const secret = process.env.SECRET as string;