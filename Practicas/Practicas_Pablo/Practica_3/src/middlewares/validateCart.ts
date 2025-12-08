import { Request, Response, NextFunction } from "express";
import { checkStock } from "../utils/checkStock";

export const validateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { items : {productId , quantity }} = req.body;
  const errores: { campo: string; mensaje: string }[] = [];
  const method = req.method;

  //Casos de POST
  if (method === "POST"){

    if (!productId || typeof productId !== "string") {
        errores.push({ campo: "productId", mensaje: "Debe existir y ser un string" });
    }

    if (!quantity || quantity <= 0 || typeof quantity !== "number") {
        errores.push({ campo: "quantity", mensaje: "Debe existir y ser un número positivo" });
    }

  
  }else if (method === "PUT"){

    if (productId !== undefined && typeof productId !== "string") {
      errores.push({ campo: "productId", mensaje: "Debe ser un string si se envía" });
    }

    if (quantity !== undefined && (typeof quantity !== "number" || quantity <= 0)) {
      errores.push({ campo: "quantity", mensaje: "Debe ser un numero  mayor a 0 si se envía" });
    }
  }

  // Si hay errores, Mostrar todos juntos
  if (errores.length > 0) {
    return res.status(400).json({ errores: errores });
  }

  // Verificar stock solo si no hay errores previos
  if (productId && quantity !== undefined) {
    const stockErrores = await checkStock(productId, quantity);

    if (stockErrores.length > 0) {
      return res.status(400).json({ errores: stockErrores });
    }
  }

  // Si pasa todo, continua a la ruta
  next();
};