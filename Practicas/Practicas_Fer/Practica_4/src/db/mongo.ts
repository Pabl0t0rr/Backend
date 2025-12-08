//Imports basics
import { Db, MongoClient } from "mongodb";

//Import environment variables
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let dB: Db;

const dbName = process.env.DB_NAME;

export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.URL_MONGO || "";
    client = new MongoClient(mongoUrl);
    await client.connect();
    dB = client.db(dbName);
    console.log("Connected to mongodb at db " + dbName);
  } catch (error) {
    console.log("Error mongo: ", error);
  }
};

export const getDB = ():Db => dB;

//Cerrar las llamadas a mongo
export const closeMongoDB = async() => {
  try {
    
    client && await client.close();

  } catch (error) {

    console.log("Error closing mongo: ", error); 
  }
};