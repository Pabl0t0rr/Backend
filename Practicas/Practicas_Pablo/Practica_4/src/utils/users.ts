//Imports basics
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

//Import rutas
import { getDB } from "../db/mongo";

//Import environment variables
import dotenv from "dotenv";

dotenv.config();

const coleccion = process.env.COLLECTION_NAME_U as string;

//Equivalente a register
export const createUser = async (email: string , password: string, username: string) => {
    const db = getDB();
    const encript = await bcrypt.hash(password, 10);

    const result = await db.collection(coleccion).insertOne({
        username,
        email,
        password: encript,
        createdAt: new Date(),
    });

    const user = await db.collection(coleccion).findOne({ _id: result.insertedId });

    if(!user) throw new Error("Error creating user");
    return user;
};

//Equivalente a login
export const validateUser = async (email : string, password : string, username: string) => {
    const db = getDB();
    const user = await db.collection(coleccion).findOne({ username: username, email: email });
    if(!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return null;

    return user;
};

//Encontrar usuario por id
export const findUserById = async (id : string) => {
    const db = getDB();
    return await db.collection(coleccion).findOne({ _id: new ObjectId(id) });
};

