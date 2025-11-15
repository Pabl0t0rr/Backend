import express from "express";
import { connectMongoDB } from "./mongo";
import routerProducts from "./routes/products";
import routerUsers from "./routes/users";
import routerCarts from "./routes/carts";

import dotenv from "dotenv";

dotenv.config();

connectMongoDB();

const app = express();
app.use(express.json());
app.use("/api/auth", routerUsers);
app.use("/api/products", routerProducts);
app.use("/api/cart", routerCarts);


//Para verificar si la ruta existe
app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    })
})

app.listen(process.env.PORT, () => console.log("Empieza a funcionar la API"));