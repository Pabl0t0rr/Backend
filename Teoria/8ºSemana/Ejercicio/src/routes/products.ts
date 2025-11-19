import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../mongo";
import { Product } from "../types";

//Import middlewares
import { authRequest,verifyToken } from "../middlewares/verifyToken";
import { validateProduct } from "../middlewares/products/validateProduct";
import { validateIdProduct } from "../middlewares/products/validateIdProduct";
import { validateBuy } from "../middlewares/products/validateBuy";

//Imports utils
import { decodeToken as decodedToken, decodeToken } from "../utils/decodeToken";


const router = Router();



const coleccionProducts = process.env.COLLECTION_NAME_P;
export const coleccion = () => getDb().collection<Product>(coleccionProducts as string);

//Obtener los productos (con filtro dependiendo de valores introducidos)
router.get("/", async (req, res) => {
    try {
        const {idCreatorUser, idsBuyer, name, description } = req.query;
        const filter  = [];
        if (idCreatorUser) filter.push({idCreatorUser : idCreatorUser.toString()});
        if(idsBuyer) filter.push({idsBuyer : ObjectId})
        if(name)filter.push({name : name.toString().toLowerCase()})  
        if(description) filter.push({description : description.toString().toLowerCase()})        
   
        const productFiltro = filter.length > 0 ? {$and : filter} : {};
        const resultados = await coleccion().find(productFiltro).toArray();
        res.status(200).json(resultados);

    } catch (err) {
        res.status(404).json({message: err});
    }
});

//Añadir un producto
router.post("/", verifyToken, validateProduct, async (req:authRequest, res) => {
    try {
        const productoCreado = await coleccion().insertOne(req.body);
        const idMongo= productoCreado.insertedId;
        const productoFinal = await coleccion().findOne({_id : idMongo});
        res.status(201).json(productoFinal);

    } catch (err) {
        res.status(500).json({message :err});
    }
});

//Modificar un producto
router.put("/:id", verifyToken, validateProduct, async (req : authRequest, res) => {
    try {
        const items : {idCreatorUser : string, idsBuyer: string[], name: string, description: string} = req.body;
        const idParametro = req.params.id;

        const productoModificado : Product = {
            idCreatorUser : items.idCreatorUser,
            idsBuyer : items.idsBuyer,
            name : items.name,
            description : items.description
        };
        
        const result = await coleccion().updateOne(
            { _id : new ObjectId(idParametro) },
            { $set : productoModificado }
        );

        res.status(200).json({modifiedProduct: productoModificado});

    } catch (err) {
        res.status(500).json({mesnaje : err});
    }
});

//Comprar un producto (añadir un idBuyer al array idsBuyer)
router.put("/", verifyToken, validateBuy, async (req : authRequest, res) => {
    try {
        const productoId : string = (req as any).productId;
        const userId : string = (req as any).tokenIdBuyerDecoded;
       
        //OBtener coleccion antes de actualizar
        const productosColeccion =  await coleccion().findOne({_id : new ObjectId (productoId)});

        //Actualizar el producto añadiendo el id del comprador al array idsBuyer
        const idsBuyerUpdates = [...(productosColeccion?.idsBuyer || []), userId]; //? por si esta vacio    
        const productAfterBuy = await coleccion().updateOne(
            {_id : new ObjectId (productoId as string)},
            {$set : {idsBuyer : idsBuyerUpdates}}
        );

        const updatedProduct = await coleccion().findOne({_id : new ObjectId (productoId)});
        res.status(200).json({modifiedProduct : updatedProduct});
    } catch (err) {
        res.status(500).json({message : err});
    }
})

router.put("/comprarProducto", verifyToken, validateBuy, async (req: authRequest, res) => {
  try {
    const { productId } = req.body;

    // Obtener id del comprador desde el token
    const idBuyer = decodeToken(req);
    
    if (!idBuyer) {
      return res.status(401).json({ message: "Token inválido o faltante" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Buscar el producto por su ID
    const producto = await coleccion().findOne({ _id: new ObjectId(productId) });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Comprobar si el comprador ya está en idsBuyer
    if (producto.idsBuyer.includes(idBuyer)) {
      return res.status(400).json({ message: "El usuario ya compró este producto" });
    }

    // Actualizar el producto: añadir idBuyer al array
    await coleccion().updateOne(
      { _id: new ObjectId(productId) },
      {
        $push: { idsBuyer: idBuyer },
      }
    );

    // Devolver producto actualizado
    const productoActualizado = await coleccion().findOne({ _id: new ObjectId(productId) });

    res.status(200).json({ modifiedProduct: productoActualizado });

  } catch (err) {
    res.status(500).json({ message: String(err) });
  }
});

//Borrar un producto
router.delete("/:id", verifyToken, validateIdProduct, async (req: authRequest, res) => {
    try {
        const idParam = req.params.id;

        const productoABorrar = await coleccion().findOne(
            {_id : new ObjectId(idParam)}
        );
        const result = await coleccion().deleteOne(
            {_id : new ObjectId(idParam)});

        res.status(200).json({productoBorrado : productoABorrar, result})
    } catch (err) {
        res.status(500).json({message : err});
    }
});
export default router;