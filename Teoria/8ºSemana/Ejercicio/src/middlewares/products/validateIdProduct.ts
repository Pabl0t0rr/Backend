import { ObjectId } from "mongodb";
import { coleccion } from "../../routes/products";
import { Request, Response, NextFunction } from "express";


export const validateIdProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const errors = [];

    if(id.length !== 24){
        errors.push({campo : "id", message : "It must have 24 characters"});
    }

    if(!ObjectId.isValid(id)){
        errors.push({campo : "id", message : "It must be a valid MongoDB ObjectId"});
    }

    if(!await coleccion().findOne({_id : new ObjectId(id)})){
        errors.push({campo : "id", message : "It must exist in the DataBase"});
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors : errors });
    }
    
      // Si pasa ambas comprobaciones, continúa
      next();
}; 