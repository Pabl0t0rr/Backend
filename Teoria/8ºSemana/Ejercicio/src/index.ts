import express from "express";
import { connectMongoDB } from "./mongo";
import routesUsers from "./routes/users";
import routesProducts from "./routes/products";
import dotenv from "dotenv";

dotenv.config();

connectMongoDB();

const app = express();

app.use(express.json());
app.use("/api/users", routesUsers);
app.use("/api/products", routesProducts);

app.listen(process.env.PORT, () => console.log("El API ha comenzado baby"));
