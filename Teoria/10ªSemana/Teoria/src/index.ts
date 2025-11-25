import { ApolloServer } from "apollo-server";
import { connectMongoDB } from "./db/mongo"
import { typeDefs } from "./graphql/squema";
import { resolvers } from "./graphql/resolvers";
import { getUserToken } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT_G;

const start = async () => {
    await connectMongoDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({req})=>{
            const token = req.headers.authorization || "";
            const user = token ? await getUserToken(token as string) : null;
            return { user };
        }
    });

    await server.listen({port: port});
    console.log("Corriendo en el puerto",port);
};



start().catch(err=>console.error(err));