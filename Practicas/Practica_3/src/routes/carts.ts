import { Router } from "express";
import { getDb } from "../mongo";
import { ObjectId } from "mongodb";

//Importar la funciones desde utils
import { decodeToken } from "../utils/decodeToken";

//Importar el middleware para las validciones
import { authRequest, verifyToken } from "../middlewares/verifyToken";
import { validateCart } from "../middlewares/validateCart";


const router = Router();

type Cart = {
  _id? : ObjectId;
  userId : ObjectId;
  items : { 
    productId : string,
    quantity: number
  },
  createdAt : Date;
  updatedAt? : Date;
};
const collectionName  = process.env.COLLECTION_NAME_C;
const coleccion = () => getDb().collection(collectionName as string);


//GET para mostrar todos los carritos con paginación
router.get("/", verifyToken, async (req : authRequest, res) => {
  try {
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 2; //Limite de 2 Carritos por pagina
    const skip = (page -1) * limit;
    const cart = await coleccion().find().skip(skip).limit(limit).toArray(); //Un cursor es un puntero de C pero en mongodb
    
     // Construir la URL base
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    // URLs de siguiente y previa página
    const nextPageUrl = cart.length === limit ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
    const previousPageUrl = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

    res.status(200).json({
      info :{
        page : page,
        numberOfCartsPerPage : limit,
        nextPage : cart.length === limit ? nextPageUrl : null,
        previousPage : page > 1 ? previousPageUrl : null
      },
      cart
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

//PUT para actualizar el carrito
router.put("/", verifyToken, validateCart, async (req : authRequest, res) => {
  try {
    const items : {productId : string, quantity: number} = req.body;
    
    //Decodificar el token para obtener el id del usuario
    const tokenDecoded = decodeToken(req);
    if (!tokenDecoded) {
        return res.status(401).json({ error: "Token inválido o faltante" });
    }

    const carro = await coleccion().findOne({ userId : tokenDecoded });

    if (!carro) {
        //no existe un carro y habra que crearlo
        console.log("nole");
        const newCart = {
            userId : tokenDecoded,
            items :{
                productId : items.productId,
                quantity : items.quantity
            },
            createdAt : new Date()
        };

        const result = await coleccion().insertOne(newCart);
        const CarritoCreado = await coleccion().findOne({ _id: result.insertedId });
        return  res.status(201).json(CarritoCreado);

    }else{
        //Actualizar el carrito existente
        console.log("sile");
        const updatedCart = {
            ...carro,
            items : req.body.items,
            updatedAt : new Date()
        };

        await coleccion().updateOne({
          userId : tokenDecoded },
          { $set: updatedCart });

        const CarritoActualizado = await coleccion().findOne({ userId : tokenDecoded });
        return res.status(200).json(CarritoActualizado);
    }

  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;


