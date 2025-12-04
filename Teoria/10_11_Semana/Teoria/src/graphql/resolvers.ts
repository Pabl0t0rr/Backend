//Imports basics
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { IResolvers } from "@graphql-tools/utils";

//Import types
import { VideoGame } from "../types/videoGame";
import { User } from "../types/users";

//Import utils
import { createUser, validateUser } from "../utils/users";
import { signToken } from "../utils/auth";

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
        },
        me: async(_,__,{ ctx } )=> {
            const user : User = ctx.user;
            if(!user) return null;
            return {
                _id: user._id.toString(),
                email: user.email,
                videoGameLibrary: user.videoGameLibrary || [],
            };
        }
    },

    User: {
        videoGameLibrary: async (parent: User) : Promise<VideoGame[]> => {
            const db = getDB();
            const videoGamesIds = parent.videoGameLibrary;
            const objetsIds = videoGamesIds.map((id) => new ObjectId(id));
            return db
            .collection<VideoGame>(process.env.COLLECTION_NAME_V!)
            .find({_id : { $in : objetsIds}})
            .toArray();
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
        },
        addVideoGameLibrary: async (_, {videoGameId}: {videoGameId: string} , {ctx}) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            const db = getDB();
            const userId = new ObjectId(user._id as string);
            const videoGameObjId = new ObjectId(videoGameId);

            const videogame = await db
            .collection<VideoGame>(process.env.COLLECTION_NAME_V!)
            .findOne({_id: videoGameObjId}
            );

            if(!videogame) throw new Error("Video game not found");

            await db.collection<User>(process.env.COLLECTION_NAME_U!)
            .updateOne({ _id: userId },
                { $addToSet: { videoGameLibrary: videoGameId } }
            );

            const updateUser = await db
            .collection<User>(process.env.COLLECTION_NAME_U!)
            .findOne({
                _id : userId
            });

            return updateUser;
        },
    },
};