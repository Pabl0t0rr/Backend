import { Request, Response, NextFunction } from "express";

export const validateCar = async (req: Request, res: Response, next: NextFunction) => {
  const { id, brand, model, year, price }= req.params;
    const errors = [];
    const method = req.method;
    if (method === "POST"){

        if(!id || typeof id !== "string"){
            errors.push({campo : "id", message : "It must exist and be a string"});
        }

        if(!brand || typeof brand !== "string"){
            errors.push({campo : "brand", message : "It must exist and be a string"});
        }

        if(!model || typeof model !== "string"){
            errors.push({campo : "model", message : "It must exist and be a text"});
        }

        if(!year || typeof year !== "number"){
            errors.push({campo : "year", message : "It must exist and be a number"});
        }

        if(!price || typeof price !== "number"){
            errors.push({campo : "price", message : "It must exist and be a number"});
        }
    
    }else if (method === "PUT"){

         if(id !== undefined || typeof id !== "string"){
            errors.push({campo : "id", message : "It must be a string to send it"});
        }

        if(!brand || typeof brand !== "string"){
            errors.push({campo : "brand", message : "It must be a string to send it"});
        }

        if(model !== undefined || typeof model !== "string"){
            errors.push({campo : "model", message : "It must be a text to send it"});
        }

        if(price !== undefined || typeof price !== "number"){
            errors.push({campo : "price", message : "It must be a number to send it"});
        }

        if(year !== undefined || typeof year !== "number"){
            errors.push({campo : "year", message : "It must be a number to send it"});
        }
    
    }else{
        console.log("No esta evaluado todavia");
    }

    // Si hay errores, Mostrar todos juntos
  if (errors.length > 0) {
    return res.status(400).json({ errors : errors });
  }

  // Si pasa ambas comprobaciones, continúa
  next();
};
