//Basics
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";


//Imports rutas
import { getDB } from "../db/mongo";
import { trainersCollection } from "../utils/utils";
import { Trainer } from "../types/trainer";


export const startJourney = async (name: string, password: string) => {
    const db = getDB();
    const passEncript = await bcrypt.hash(password, 10);

    const result = await db.collection<Trainer>(trainersCollection).insertOne({
        _id: new ObjectId(),
        name,
        password: passEncript,
        pokemons : []
    });

    return result.insertedId.toString();
};

export const validateTrainer = async (name: string, password: string) => {
    const db = getDB();
    const user = await db.collection(trainersCollection).findOne({name});
    if( !user ) return null;

    const laPassEsLaMismaMismita = await bcrypt.compare(password, user.password);
    if(!laPassEsLaMismaMismita) return null;

    return user;
};

export const finddTrainerById = async (id: string) => {
    const db = getDB();
    const existTrainer =  await db.collection(trainersCollection).findOne({_id: new ObjectId(id)})
    return existTrainer ? existTrainer : null;
}

// Prevent creating users with the same email
export const nameExists = async (name: string) => {
    const db = getDB();
    const user = await db.collection(trainersCollection).findOne({ name });
    return user ? true : false; // true if exists
};

//Validate internal fields for login and register
export const validateUserData = (email: string, password: string) => {
    const errors: string[] = [];

    // Validate email
    if (typeof email !== "string" || email.trim() === "" || !email) {
        errors.push("Email cannot be empty or different from a string");
    } else {
        // Validate that email has username, '@', domain and extension (at least 2 letters)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push("Email is not valid format (name@domain.extension) ");
        }
    }

    // Validate password
    if (typeof password !== "string" || password.trim() === "" || !password) {
        errors.push("Password cannot be empty or different from a string");
    } else if (password.trim().length < 6) {
        errors.push("Password must have at least 6 characters");
    }

    // Validate User if need
    // if(typeof username !== "string" || username.trim() === ""){ errors.push("Username cannot be empty or different from a string");
    // } else if (username.trim().length < 3) { errors.push("Username must have at least 3 characters");}
   
    return errors;
};