import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { coleccion } from "../routes";

export const validateId = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Comprobar longitud de 24 caracteres
  if (id.length !== 24) {
    return res.status(400).json({ message: "ID debe tener 24 caracteres" });
  }

  // Comprobar que sea un ObjectId válido
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  // Comprobar que el ID existe en la base de datos
  if (!await coleccion().findOne({_id: new ObjectId(id)})){
    return res.status(404).json({ message: "ID insertado no existe" });
      }
  // Si pasa ambas comprobaciones, continúa
  next();
};
