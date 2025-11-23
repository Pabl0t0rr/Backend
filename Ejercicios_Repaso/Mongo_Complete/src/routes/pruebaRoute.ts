import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../mongo";

//Imports types
import { Coche } from "../types";

//Import middlewares
import { authRequest,verifyToken } from "../middlewares/verification/verifyToken";
import { validateCar } from "../middlewares/car/validateCar";

const router = Router();


const coleccionProducts = process.env.COLLECTION_NAME_C;
export const coleccion = () => getDb().collection<Coche>(coleccionProducts as string);


//Rutas

//GET todos los cohes con filtro
router.get("/", async (req, res) => {
    try {   
        const {brand, model, year, year_lt, year_gt, price, price_lt, price_gt} = req.query;
        const filter  = [];

        if(brand)filter.push({brand : brand});
        if(model)filter.push({model : model});
        if(year)filter.push({year : Number(year)});
        //For been able to look for greater than or less than for years
        if(year_lt)filter.push({year : {$lt : Number(year_lt)}});
        if(year_gt)filter.push({year : {$gt : Number(year_gt)}});
        if(price)filter.push({price : Number(price)});

        //For been able to look for greater than or less than for price
        if(price_lt)filter.push({price : {$lt : Number(price_lt)}});
        if(price_gt)filter.push({price : {$gt : Number(price_gt)}});

        const filterCar =  (filter.length > 0) ? { $or: filter } : {};
        const results = await coleccion().find(filterCar).toArray();
        res.status(200).json({filterCars : results});

    }catch (err) {
        res.status(500).json({message : err});
    }
});

router.post("/", validateCar, async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json({message : err});
    }
});

export default router;