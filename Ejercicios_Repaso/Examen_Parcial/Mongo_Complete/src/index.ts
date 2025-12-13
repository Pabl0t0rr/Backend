//Postman
import express from "express";
import{ connectMongoDB } from "./mongo";
import rutaPrueba from "./routes/pruebaRoute";

//Apollo Server
import { ApolloServer } from "apollo-server";
import { schema as typeDefs } from "./graphql/squema";
import { resolvers } from "./graphql/resolvers";

//Mongo
connectMongoDB();

//Variables de entorno
import dotenv from "dotenv";
dotenv.config();

const server = new ApolloServer({typeDefs, resolvers});

const app = express();
app.use(express.json());
app.use("/api/car", rutaPrueba);

app.listen(process.env.PORT_P, () => console.log("Postman server listening on port " + process.env.PORT_P));

//Para poder usar Apollo Server
server.listen(process.env.PORT_A, () => console.log("Apollo server listening on port " + process.env.PORT_A));