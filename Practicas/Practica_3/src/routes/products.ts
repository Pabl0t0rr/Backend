import { Router } from "express";
import { getDb } from "../mongo";
import { ObjectId } from "mongodb";

//Importar el middleware para las validciones
import { authRequest, verifyToken } from "../middlewares/verifyToken";
import { validateProduct } from "../middlewares/validateProduct";


const router = Router();

type Product = {
  _id? : ObjectId;
  name : string;
  descripcion : string;
  price : number,
  stock : number;
  createdAt? : Date;
};

const collectionName  = process.env.COLLECTION_NAME_P;
 export const coleccion = () => getDb().collection<Product>(collectionName as string);


//GET para todos los productos que hay
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 2; //Limite de 2 Productos por pagina
    const skip = (page -1) * limit;
    const productos = await coleccion().find().skip(skip).limit(limit).toArray(); //Un cursor es un puntero de C pero en mongodb

    // Construir la URL base
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    // URLs de siguiente y previa página
    const nextPageUrl = productos.length === limit ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
    const previousPageUrl = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

    res.status(200).json({
      info :{
        page : page,
        numberOfProductosPerPage : limit,
        nextPage : productos.length === limit ? nextPageUrl : null,
        previousPage : page > 1 ? previousPageUrl : null
      },
      productos,
      
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

//POST para productos
router.post(`/`,verifyToken, validateProduct, async (req : authRequest, res) => {
  try {
 
    const productoAInsertar = { ...req.body, createdAt: new Date() };
    const result = await coleccion().insertOne(productoAInsertar);
    const ProductoCreado = await coleccion().findOne({ _id: result.insertedId });
    res.status(201).json(ProductoCreado);

  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;