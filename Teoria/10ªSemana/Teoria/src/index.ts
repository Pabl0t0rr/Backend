import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/squema";
import { resolvers } from "./graphql/resolvers";

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port: 4000}).then(({url}) => {
    console.log(`Servidor escuchando en la url ${url}`);
});