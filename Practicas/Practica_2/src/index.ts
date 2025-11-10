import express from "express";
import { connectMongoDB } from "./mongo";
import routerPersonas from "./routes";
import dotenv from "dotenv";

dotenv.config();

connectMongoDB();

const app = express();
app.use(express.json());
app.use("/api/books", routerPersonas);

//Para probar la ruta en la que esta
app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    })
})

app.listen(process.env.PORT, () => console.log("Empiez a funcionar la API"));