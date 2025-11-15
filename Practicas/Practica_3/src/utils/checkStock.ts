// src/services/product.service.ts
import { ObjectId } from "mongodb";
import { coleccion  } from "../routes/products";

export const checkStock = async (productId: string, quantity: number) => {
  const errores: { campo: string; mensaje: string }[] = [];
  const producto = await coleccion().findOne({ _id: new ObjectId(productId) });

  if (!producto) {
    errores.push({
        campo: "productId",
        mensaje: "El producto no existe en la base de datos"
    });
  } else if (quantity > producto.stock) {
    errores.push({
        campo: "quantity",
        mensaje: `No hay suficiente stock. Stock disponible: ${producto.stock}`
    });
  }
  //Hacer el cambio de stock de forma dinamica
  await coleccion().updateOne({ 
    _id: new ObjectId(productId), stock: { $gte: quantity } }, 
    { $inc: { stock: -quantity }
  });

  return errores;
};
