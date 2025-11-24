import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";

//Import routes
import { coleccion } from "../../routes/products";


export const validateIdProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.body;
    const errors = [];

    if(productId.length !== 24){
        errors.push({campo : "productId", message : "It must have 24 characters"});
    }

    if(!productId || typeof productId !== "string"){
        errors.push({campo : "productId", message : "It must exist and be a string"});
    }

    if(!await coleccion().findOne({_id : new ObjectId(productId as string)})){
        errors.push({campo : "productId", message : "It must exist in the DataBase"});
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors : errors });
    }
    
      // Si pasa ambas comprobaciones, continúa
      next();
}; 