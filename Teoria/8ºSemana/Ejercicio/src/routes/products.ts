import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../mongo";
import { JwtPayload, Product } from "../types";

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
        if (idCreatorUser) filter.push({idCreatorUser : idCreatorUser});
        if(idsBuyer) filter.push({idsBuyer : idsBuyer});
        if (name) filter.push({name : name})  
        if (description) filter.push({description : description})
   
        const productFiltro = filter.length > 0 ? {$or : filter} : {}; //Cambiar el and por or si quiero otro formato en postaman
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
        const userId: string = (req.user as JwtPayload)?.id;
       
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