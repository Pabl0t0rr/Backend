import express from "express";
import { connectMongoDB } from "./mongo";
import routerPersonas from "./routes";
import dotenv from "dotenv";

dotenv.config();

connectMongoDB();

const app = express();
app.use(express.json());
app.use("/api/disk", routerPersonas);
app.listen(process.env.PORT, () => console.log("El API ha comenzado baby"));
