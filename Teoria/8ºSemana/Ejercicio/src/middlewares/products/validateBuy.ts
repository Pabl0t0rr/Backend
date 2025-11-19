import {Response , Request, NextFunction} from "express";
import { coleccion } from "../../routes/products";

//Imports utils
import { decodeToken } from "../../utils/decodeToken";
import { ObjectId } from "mongodb";

export const validateBuy = async (req : Request, res: Response, next: NextFunction) => {
    const {productId} = req.body;
    const errors  = [];

    const tokenIdBuyerDecoded = decodeToken(req);
    
    if (!tokenIdBuyerDecoded) { 
            return res.status(401).json({ message: "No valid Token or missing token" });
    };

    if(!productId || typeof productId !== "string"){
        errors.push({campo : "productId", message : "It is required and must be a string"});
    }

    const findProduct = await coleccion().findOne ({_id : new ObjectId(productId as string)});

    if(!findProduct){
        errors.push({campo : "productId", message : "The productId must exist in the DataBase"});
    }

    if (findProduct?.idsBuyer.includes(tokenIdBuyerDecoded)){
        errors.push({campo : "productId", message : "The buyer already bought the product"});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors : errors });
    }

    //Devolver datos necesarios
    (req as any).tokenIdBuyerDecoded = tokenIdBuyerDecoded; 
    (req as any).productId = productId;
    
    // Si pasa ambas comprobaciones, continúa
    next();

};