import {Response , Request, NextFunction} from "express";
import { ObjectId } from "mongodb";

//Imports route
import { coleccion } from "../../routes/products";


export const validateBuy = async (req : Request, res: Response, next: NextFunction) => {
    const {productId} = req.body;
    const errors  = [];


    if(!productId || typeof productId !== "string"){
        errors.push({campo : "productId", message : "It is required and must be a text"});
    }

    const findProduct = await coleccion().findOne ({_id : new ObjectId(productId as string)});

    if(!findProduct){
        errors.push({campo : "productId", message : "The productId does not exist"});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors : errors });
    }
    
    // Si pasa ambas comprobaciones, continúa
    next();

};