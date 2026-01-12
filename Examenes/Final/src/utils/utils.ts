import dotenv from 'dotenv';
dotenv.config();

//Ports
export const port = process.env.PORT;

//Urls
export const urlMongo = process.env.URL_MONGO as string

//Data base
export const dbName = process.env.NAME_DB as string

//Collections
export const trainersCollection = process.env.COLLECTION_NAME_E as string
export const pokemonsCollection = process.env.COLLECTION_NAME_P as string
export const ownedPokemonsCollection = process.env.COLLECTION_NAME_O as string


//Secrets
export const secret = process.env.SECRET as string;