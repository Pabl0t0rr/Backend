//Imports Basics
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

//Import Rutas
import { getDB } from "../db/mongo";

//Import Utils
import { userCollection } from "../utils/utils";
import { User } from "../types/users";

//Equivalente a register
export const createUser = async (email: string , username: string, password: string) => {
    const db = getDB();
    const encript = await bcrypt.hash(password, 10);

    const result = await db.collection(userCollection).insertOne({
        username,
        email,
        password: encript,
        createdAt: new Date(),
    });

    const user = await db.collection(userCollection).findOne({ _id: result.insertedId });

    if(!user) throw new Error("Error creating user");
    return user;
};

//Equivalente a login
export const validateUser = async (email : string, password : string, username: string) => {
    const db = getDB();
    const user = await db.collection(userCollection).findOne({ username: username, email: email });
    if(!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return null;

    return user;
};

//Encontrar usuario por id
export const findUserById = async (id : string) => {
    const db = getDB();
    return await db.collection(userCollection).findOne({ _id: new ObjectId(id) });
};

//Validar campos internos en el login y registro
export const validateUserData = (email : string, username: string, password : string) => {
    const errors : string[] = [];

    if(typeof email !== "string" || email.trim() === "")  errors.push("El email no puede estar vacio o ser distinto de un string");
    else {const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/; //Validacmos que haya nombre de usuario, '@', dominio y extension con al menos 2 letras
        if(!emailRegex.test(email)) errors.push("El email no es valido");
    }
    if(typeof username !== "string" || username.trim() === ""){ errors.push("El campo nombre de usuario no puede estar vacio o ser distinto de un string");
    } else if (username.trim().length < 3) { errors.push("El nombre de usuario debe tener al menos 3 caracteres");}
    if(typeof password !== "string" || password.trim() === ""){ errors.push("La contraseña no puede estar vacia o ser distinto de un string")
    }else if (password.trim().length < 6) {errors.push("La contraseña debe tener al menos 6 caracteres");}
    return errors;    
}

//Comprobar si ya esxiste alguien con ese nombre de usuario
export const duplicateName = async(username : string) => {
    const db = getDB();
    const exist = await db.collection<User>(userCollection).findOne({username});
    return exist ? true : false;
}
