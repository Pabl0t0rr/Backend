import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { IResolvers } from "@graphql-tools/utils";

//Import types
import { VideoGame } from "../types/types";

//Import environment variables
import dotenv from "dotenv";
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
            }
        }
    }
}