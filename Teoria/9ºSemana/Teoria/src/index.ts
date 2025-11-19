import { ApolloServer } from "apollo-server";
import { schema as typeDefs } from "./squema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port: 4000}).then(({url}) => {
    console.log(`Servidor escuchando en la url ${url}`);
});