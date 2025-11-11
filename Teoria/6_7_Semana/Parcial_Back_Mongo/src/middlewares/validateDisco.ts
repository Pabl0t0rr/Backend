import { Request, Response, NextFunction } from "express";

export const validateDisco = (req: Request, res: Response, next: NextFunction) => {
  const { id, filmName, rotationType, region, lengthMinutes, videoFormat } = req.body;
  const errores: { campo: string; mensaje: string }[] = [];
  const method = req.method;

  //Casos de POST
  if (method === "POST"){

    if (!id || typeof id !== "number") {
    errores.push({ campo: "id", mensaje: "Debe existir y ser un número" });
  }

  if (!filmName || typeof filmName !== "string") {
    errores.push({ campo: "filmName", mensaje: "Debe existir y ser una cadena" });
  }

  if (!rotationType || !["CAV", "CLV"].includes(rotationType)) {
    errores.push({ campo: "rotationType", mensaje: "Debe ser 'CAV' o 'CLV'" });
  }

  if (!region || typeof region !== "string") {
    errores.push({ campo: "region", mensaje: "Debe existir y ser una cadena" });
  }

  if (lengthMinutes === undefined || typeof lengthMinutes !== "number") {
    errores.push({ campo: "lengthMinutes", mensaje: "Debe existir y ser un número" });
  }

  if (!videoFormat || !["NTSC", "PAL"].includes(videoFormat)) {
    errores.push({ campo: "videoFormat", mensaje: "Debe ser 'NTSC' o 'PAL'" });
  }
  }
  else if (method === "PUT"){

    if (id !== undefined && typeof id !== "number") {
    errores.push({ campo: "id", mensaje: "Debe ser un número si se envía" });
    }

    if (filmName !== undefined && typeof filmName !== "string") {
      errores.push({ campo: "filmName", mensaje: "Debe ser una cadena si se envía" });
    }

    if (rotationType !== undefined && !["CAV", "CLV"].includes(rotationType)) {
      errores.push({ campo: "rotationType", mensaje: "Debe ser 'CAV' o 'CLV' si se envía" });
    }

    if (region !== undefined && typeof region !== "string") {
      errores.push({ campo: "region", mensaje: "Debe ser una cadena si se envía" });
    }

    if (lengthMinutes !== undefined && typeof lengthMinutes !== "number") {
      errores.push({ campo: "lengthMinutes", mensaje: "Debe ser un número si se envía" });
    }

    if (videoFormat !== undefined && !["NTSC", "PAL"].includes(videoFormat)) {
      errores.push({ campo: "videoFormat", mensaje: "Debe ser 'NTSC' o 'PAL' si se envía" });
    }

  }

  // Si hay errores, Mostrar todos juntos
  if (errores.length > 0) {
    return res.status(400).json({ errores : errores });
  }

  // Si pasa todo, continua a la ruta
  next();
};
