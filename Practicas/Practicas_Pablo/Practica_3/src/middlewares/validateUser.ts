import { Request, Response, NextFunction } from "express";

export const registerUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password} = req.body;
  const errores: { campo: string; mensaje: string }[] = [];
  const method = req.method;

  //Casos de POST
  if (method === "POST"){
    if (!username || typeof username !== "string") {
        errores.push({ campo: "username", mensaje: "Debe existir y ser una cadena" });
    }

    if (!email || typeof email !== "string") {
        errores.push({ campo: "email", mensaje: "Debe existir y ser una cadena" });
    }else{
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!emailValid){
        errores.push({ campo: "email", mensaje: "Debe tener un formato de email válido" });
      }
    }

    if (!password || typeof password !== "string") {
        errores.push({ campo: "password", mensaje: "Debe existir y ser una cadena" });
    }

  }else if (method === "PUT"){
  
  }

  // Si hay errores, Mostrar todos juntos
  if (errores.length > 0) {
    return res.status(400).json({ errores : errores });
  }

  // Si pasa todo, continua a la ruta
  next();
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errores: { campo: string; mensaje: string }[] = [];
  const method = req.method;

  //Casos de POST
  if (method === "POST"){

    if (!email || typeof email !== "string") {
        errores.push({ campo: "email", mensaje: "Debe existir y ser una cadena" });
    }else{
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!emailValid){
        errores.push({ campo: "email", mensaje: "Debe tener un formato de email válido" });
      }
    }

    if (!password || typeof password !== "string") {
        errores.push({ campo: "password", mensaje: "Debe existir y ser una cadena" });
    }

  }else if (method === "PUT"){
  
  }

  // Si hay errores, Mostrar todos juntos
  if (errores.length > 0) {
    return res.status(400).json({ errores : errores });
  }

  // Si pasa todo, continua a la ruta
  next();
};