import { Request, Response, NextFunction } from "express";

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, stock} = req.body;
  const errores: { campo: string; mensaje: string }[] = [];
  const method = req.method;

  //Casos de POST
  if (method === "POST"){
    if (!name || typeof name !== "string") {
        errores.push({ campo: "name", mensaje: "Debe existir y ser una cadena" });
    }

    if (typeof description !== "string") {
        errores.push({ campo: "description", mensaje: "Debe ser una cadena" });
    }

    if (price <= 0 || typeof price !== "number") {
        errores.push({ campo: "price", mensaje: "Debe ser mayor a 0 y ser un numero" });
    }

    if (stock < 0 || typeof stock !== "number") {
        errores.push({ campo: "stock", mensaje: "Debe ser mayor o igual a 0 y ser un número" });
    }

  
  }else if (method === "PUT"){
    if (name !== undefined && typeof name !== "string") {
      errores.push({ campo: "name", mensaje: "Debe ser una cadena si se envía" });
    }

    if (description !== undefined && typeof description !== "string") {
      errores.push({ campo: "description", mensaje: "Debe ser una cadena si se envía" });
    }

    if (price !== undefined && typeof price !== "number" && price > 0) {
      errores.push({ campo: "price", mensaje: "Debe ser un numero si se envía" });
    }

    if (stock !== undefined && typeof stock !== "number" && stock >= 0) {
      errores.push({ campo: "stock", mensaje: "Debe ser un número si se envía" });
    }

  }

  // Si hay errores, Mostrar todos juntos
  if (errores.length > 0) {
    return res.status(400).json({ errores : errores });
  }

  // Si pasa todo, continua a la ruta
  next();
};