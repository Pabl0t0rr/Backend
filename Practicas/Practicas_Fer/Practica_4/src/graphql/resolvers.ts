//Imports basics
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { IResolvers } from "@graphql-tools/utils";

//Import types
import { Post } from "../types/post";
import { User } from "../types/users";

//Import utils
import { createUser, validateUser, validateData } from "../utils/users";
import { signToken } from "../utils/auth";

//Import environment variables
import dotenv from "dotenv";


//Variables para escalabilidad mas accesible
const cole_User = process.env.COLLECTION_NAME_U as string;
const cole_Post = process.env.COLLECTION_NAME_P as string;


dotenv.config();

export const resolvers: IResolvers = {
    Query: {
       
      
    },

    Mutation: {
        //Funciona
        // login_: async (_, {input} : {input: {email: string, password: string, username: string}} ) => {
        //     const user = await validateUser(input.email, input.password, input.username);
        //     if(!user) throw new Error("Invalid credentials");
        //     return {
        //         token: signToken(user._id.toString()),
        //         user,
        //     }
        // },

        register: async(_, {input} : {input : {email: string, password: string, username: string}}) => {
            //Comprobar que lo que se inserta son valores validos
            const validate = validateData(input.email, input.username, input.password)
            if(validate.length > 0) throw new Error(validate.join(" | ")) //Comporbacion basica de los parametros

            //Comprobar si ya existe un usuario con ese nombre o correo
            const userExist = await getDB()
            .collection<User>(cole_User)
            .findOne({$or : [
                {email : input.email},
                {username: input.username}
            ]});

            if(userExist) return new Error("Usuario con ese correo o nombre ya esta creado");
            
            const user = await createUser(input.email, input.username, input.password);

            return {
                token: signToken(user._id.toString()),
                user
            }
        },   
        
        login: async(_, {input} : {input : {username : string, email: string, password: string}}) => {
             

        },
    },
};