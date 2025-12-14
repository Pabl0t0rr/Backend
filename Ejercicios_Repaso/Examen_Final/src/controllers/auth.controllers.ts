//Imports basics
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

//Imports routes
import { getDB } from "../db/mongo";
import { tokenPayload } from "../types/auth";
import {organicerCollection, secret, studentCollection} from "../utils/utils";

export const signToken = (userId : string) => jwt.sign({ userId }, secret as string, { expiresIn: "1h" });

export const verifyToken = (token : string) : tokenPayload | null => {
    try {
        return jwt.verify(token as string, secret as string) as tokenPayload;
    } catch (err) {
        return null;
    }
}

export const getUserToken = async (token: string) => {
    // Primero intentamos obtener un organicer
    const organicer = await getOrganicerToken(token);
    if (organicer) return { ...organicer};

    // Si no, intentamos obtener un student
    const student = await getStudentToken(token);
    if (student) return { ...student };

    return null; // no se encontró usuario
}

export const getOrganicerToken = async (token : string) => {
    try {
        const payload = verifyToken(token);
        if(!payload) return null;
        const db = getDB();
        return await db.collection(organicerCollection).findOne({ _id: new ObjectId(payload.userId) });

    } catch (err) {
        return null;
    }
}

export const getStudentToken = async (token : string) => {
    try {
        const payload = verifyToken(token);
        if(!payload) return null;
        const db = getDB();
        return await db.collection(studentCollection).findOne({ _id: new ObjectId(payload.userId) });

    } catch (err) {
        return null;
    }
}