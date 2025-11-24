import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let dB: Db;

const dbName = process.env.DB_NAME;

export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUrl = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@${process.env.MONGO_CLUSTER}.ealqluz.mongodb.net/?appName=${process.env.MONGO_APP_NAME}`;
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