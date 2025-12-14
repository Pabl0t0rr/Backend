//Imports basics
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

//Import rutas
import { getDB } from "../db/mongo";

//Import  utils
import { studentCollection } from "../utils/utils";

//Equivalente a register
export const createStudent = async (name: string,email: string , password: string) => {
    const db = getDB();
    const encript = await bcrypt.hash(password, 10);

    const result = await db.collection(studentCollection).insertOne({
        name,
        email,
        password: encript,
        createdAt: new Date(),
        enrolledCourses: []
    });

    const user = await db.collection(studentCollection).findOne({ _id: result.insertedId });

    if(!user) return null;
    return user;
};

//Equivalente a login
export const validateStudent = async (email : string, password : string) => {
    const db = getDB();
    const user = await db.collection(studentCollection).findOne({ email: email });
    if(!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return null;

    return user;
};

//Encontrar student por id
export const findStudentById = async (id : string) => {
    const db = getDB();
    return await db.collection(studentCollection).findOne({ _id: new ObjectId(id) });
};


export const duplicatedEmailS = async (email : string) => {
    const db = getDB();
    const valid = await db.collection(studentCollection).findOne({email : email});
    return valid ? false : true;
};

