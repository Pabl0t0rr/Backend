import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { IResolvers } from "@graphql-tools/utils";

//Import types
import { VideoGame } from "../types/videoGame";

//Import environment variables
import dotenv from "dotenv";
import { User } from "../types/users";
import { createUser, validateUser } from "../utils/users";
import { signToken } from "../utils/auth";
import { validate } from "graphql";
dotenv.config();

export const resolvers: IResolvers = {
    Query: {
        videoGames: async () => {  
            const db = getDB();  
            return db.collection<VideoGame>(process.env.COLLECTION_NAME_V!).find().toArray();
        },

        videoGame: async (_, {id})=>{
            const db = getDB();  
            return db.collection<VideoGame>(process.env.COLLECTION_NAME_V!).findOne({_id: new ObjectId(id as string) as any});
        },
        me: async(_,__,{ ctx } )=> {
            const user : User = ctx.user;
            if(!user) return null;
            return {
                _id: user._id.toString(),
                email: user.email
            };
        }
    },

    Mutation: {
        addVideoGame: async (_, {name , platform, date})=>{
            const db = getDB();
            const result = await db.collection<VideoGame>(process.env.COLLECTION_NAME_V!).insertOne({
                name,
                platform,
                date
            });
            return {
                _id: result.insertedId,
                name,
                platform,
                date
            };
        },
        register: async (_,{email, password} : {email: string, password: string} ) => {
            const userId = await createUser(email, password);
            return signToken(userId);
        },
        login: async (_, {email, password} : {email: string, password: string} ) => {
            const user = await validateUser(email, password);
            if(!user) throw new Error("Invalid credentials");
            return signToken(user._id.toString())
        }
    }
}