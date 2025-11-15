import express from "express";
import { connectMongoDB } from "./mongo";
import routesAuth from "./routes/auth";
import routesPatata from "./routes/patata";
import dotenv from "dotenv";

dotenv.config();

connectMongoDB();

const app = express();
app.use(express.json());
app.use("/auth", routesAuth);
app.use("/patata", routesPatata);

app.listen(process.env.PORT, () => console.log("El API ha comenzado baby"));
