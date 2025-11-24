import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { JwtPayload, Product } from "../types/types";

//Import middlewares
import { authRequest,verifyToken } from "../middlewares/verifyToken";
import { validateProduct } from "../middlewares/products/validateProduct";
import { validateIdProduct } from "../middlewares/products/validateIdProduct";
import { validateBuy } from "../middlewares/products/validateBuy";

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
   
        const productFiltro = filter.length > 0 ? {$or : filter} : {}; //Cambiar el and por or si quiero otro formato en postman
        const resultados = await coleccion().find(productFiltro).toArray();
        res.status(200).json(resultados);

    } catch (err) {
        res.status(404).json({message: err});
    }
});

//Añadir un producto
router.post("/", verifyToken, validateProduct, async (req:authRequest, res) => {
    try {
        const userId : string = (req.user as JwtPayload)?.id;
        const idsBuyerInit : string [] = [];

        const productoCreado = await coleccion().insertOne({
            ...req.body,
            idCreatorUser : userId,
            idsBuyer : idsBuyerInit,
            name : req.body.name,
            description : req.body.description
        });
        const idMongo= productoCreado.insertedId;
        const productoFinal = await coleccion().findOne({_id : idMongo});
        res.status(201).json(productoFinal);

    } catch (err) {
        res.status(500).json({message :err});
    }
});

//Modificar un producto
router.put("/", verifyToken, validateProduct, async (req : authRequest, res) => {
    try {

        const items : { productoId : string, idsBuyer: string[], name: string, description: string} = req.body;
        const userId : string = ( req.user as JwtPayload)?.id;

        //Comprobar que el  usuario que quiere modificar el producto es el idCreatorUser del producto
        const usuarioCorrecto = await coleccion().findOne(
            { _id : new ObjectId(items.productoId) }
        );

        if(usuarioCorrecto?.idCreatorUser !== userId){
            return  res.status(403).json({message : "You are not allowed to modify this product"});
        }

        //Actualizar el producto
        const productoModificado : Product = {
            idCreatorUser : userId,
            idsBuyer : items.idsBuyer,
            name : items.name,
            description : items.description
        };
        
        const result = await coleccion().updateOne(
            { _id : new ObjectId(items.productoId) },
            { $set : productoModificado }
        );

        res.status(200).json({modifiedProduct: productoModificado});

    } catch (err) {
        res.status(500).json({mesnaje : err});
    }
});

//Comprar un producto (añadir un idBuyer al array idsBuyer)
router.put("/buy", verifyToken, validateBuy, async (req : authRequest, res) => {
    try {
        const productoId : string =  req.body.productoId;
        const userId: string = (req.user as JwtPayload)?.id;
       
        //Comprobar si el usuario ya ha comprado el producto
        const productoComprado =  await coleccion().findOne({
            _id : new ObjectId (productoId),
            idsBuyer :  { $in : [userId] } //Comprobar si el id del usuario esta en el array idsBuyer
        });


        //Actualizar el producto añadiendo el id del comprador al array idsBuyer
        const idsBuyerUpdates = [...(productoComprado?.idsBuyer || []), userId]; //Poner ? por si es vacio y en caso vacio poner un array vacio
  
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
router.delete("/", verifyToken, validateIdProduct, async (req, res) => {
    try {
        const productId : string = req.body.productId;

        const productoBorrar = await coleccion().findOne(
            {_id : new ObjectId(productId)}
        );
        const result = await coleccion().deleteOne(
            {_id : new ObjectId(productId)});

        res.status(200).json({productoBorrado : productoBorrar, result})
    } catch (err) {
        res.status(500).json({message : err});
    }
});
export default router;