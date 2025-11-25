import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";

import bcrypt from "bcryptjs";

import dotenv from "dotenv";

dotenv.config();

const coleccion = process.env.COLLECTION_NAME_U as string;

//Equivalente a register
export const createUser = async (email: string , password: string) => {
    const db = getDB();
    const encript = await bcrypt.hash(password, 10);

    const result = await db.collection(coleccion).insertOne({
        email,
        password: encript,
    });
    return result.insertedId.toString();
};

//Equivalente a login
export const validateUser = async (email : string, password : string) => {
    const db = getDB();
    const user = await db.collection(coleccion).findOne({ email });
    if(!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    
    if(!isValid) return null;

    return user;
}

export const findUserById = async (id : string) => {
    const db = getDB();
    return await db.collection(coleccion).findOne({ _id: new ObjectId(id) });
};

