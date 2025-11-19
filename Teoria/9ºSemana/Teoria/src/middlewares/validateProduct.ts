import { Request, Response, NextFunction } from "express";

export const validateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { idCreatorUser, idsBuyer,name,description }= req.params;
    const errors = [];
    const method = req.method;
    if (method === "POST"){

        if(!idCreatorUser || typeof idCreatorUser !== "number"){
            errors.push({campo : "idCreatorUser", message : "It must exist and be a number"});
        }

        if(!idsBuyer || (Array.isArray(idsBuyer) && idsBuyer.every(item => typeof item === "string"))){
            errors.push({campo : "idsBuyer", message : "It must exist and be an array of text IDS"});
        }

        if(!name || typeof name !== "string"){
            errors.push({campo : "name", message : "It must exist and be a text"});
        }

        if(!description || typeof description !== "string"){
            errors.push({campo : "description", message : "It must exist and be a text"});
        }
    
    }else if (method === "PUT"){

         if(idCreatorUser !== undefined || typeof idCreatorUser !== "number"){
            errors.push({campo : "idCreatorUser", message : "It must be a number to send it"});
        }

        if(!idsBuyer || (Array.isArray(idsBuyer) && idsBuyer.every(item => typeof item === "string"))){
            errors.push({campo : "idsBuyer", message : "It must be an array of text IDS to send it"});
        }

        if(name !== undefined || typeof name !== "string"){
            errors.push({campo : "name", message : "It must be a text to send it"});
        }

        if(description !== undefined || typeof description !== "string"){
            errors.push({campo : "description", message : "It must be a text to send it"});
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
