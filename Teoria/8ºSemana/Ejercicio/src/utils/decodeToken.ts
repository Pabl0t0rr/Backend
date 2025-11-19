import { Request } from "express";
import jwt from "jsonwebtoken";

//Funcion para decodificar el token
export const decodeToken = (req: Request): string | null => {
  const auth = req.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return null; // no respondemos, solo devolvemos null
  }

  const token = jwt.decode(auth.substring(7));
  if (token && typeof token !== "string") {
    return token["id"]; // devolvemos el id decodificado
  }

  return null; // token inválido o formato inesperado
};