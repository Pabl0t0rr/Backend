import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { JwtPayload, User } from "../types/user";
import { Product } from "../types/product";

//Import middlewares
import { authRequest,verifyToken } from "../middlewares/verifyToken";
import { validateProduct } from "../middlewares/products/validateProduct";
import { validateIdProduct } from "../middlewares/products/validateIdProduct";

const router = Router();

const coleccionProductsName = process.env.COLLECTION_NAME_P;
export const coleccion = () => getDb().collection<Product>(coleccionProductsName as string);
const coleccionUsers = () => getDb().collection<User>(process.env.COLLECTION_NAME_U as string);


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
        const idsBuyerInit : string [] = []; //Para iniciarlo vacio cnd se crea el producto

        const productoCreado = await coleccion().insertOne({
            idCreatorUser : userId,
            idsBuyer : idsBuyerInit,
            ...req.body            
        });
        const idMongo= productoCreado.insertedId;
        const productoFinal = await coleccion().findOne({_id : idMongo});
        res.status(201).json({newProduct : productoFinal});

    } catch (err) {
        res.status(500).json({message :err});
    }
});

//Modificar un producto
router.put("/", verifyToken, validateProduct, async (req : authRequest, res) => {
    try {

        const { productId , name, description } = req.body;
        const userId : string = ( req.user as JwtPayload)?.id;

        //Comprobar que el  usuario que quiere modificar el producto es el idCreatorUser del producto
        const usuarioCorrecto = await coleccionUsers().findOne(
            { _id : new ObjectId(userId as string) }
        );

        const productoAmodificar = await coleccion().findOne({
            _id: new ObjectId(productId as string)
        });

        //Comprobar que el usuario que quiere modificar el producto es el idCreatorUser del producto
        if( productoAmodificar?.idCreatorUser !== usuarioCorrecto?._id.toString()){
            return  res.status(403).json({message : "You are not allowed to modify this product because is not yours"});
        }


        //Actualizar el producto
        const productoModificado : Product = {
            idCreatorUser : userId,
            idsBuyer : productoAmodificar?.idsBuyer || [],
            name,
            description
        };
        
        const result = await coleccion().updateOne(
            { _id : new ObjectId(productId as string) },
            { $set : productoModificado }
        );

        res.status(200).json({modifiedProduct: productoModificado});

    } catch (err) {
        res.status(500).json({mensaje : err});
    }
});

//Comprar un producto (añadir un idBuyer al array idsBuyer)
router.put("/buy", verifyToken, validateIdProduct, async (req : authRequest, res) => {
    try {
        const { productId } =  req.body;
        const userId: string = (req.user as JwtPayload)?.id;
       

        const producto = await coleccion().findOne({
            _id: new ObjectId(productId as string)
        });

         if (producto?.idsBuyer?.includes(userId)) {
            return res.status(400).json({ message: "You have already bought this product" });
        }

        //Actualizar el producto añadiendo el id del comprador al array idsBuyer
        const idsBuyerUpdates = [...(producto?.idsBuyer || []), userId]; //Poner ? por si es vacio y en caso vacio poner un array vacio
  
        await coleccion().updateOne(
            {_id : new ObjectId (productId as string)},
            {$set : {idsBuyer : idsBuyerUpdates}}
        );

        const updatedProduct = await coleccion().findOne({_id : new ObjectId (productId as string)});
        res.status(200).json({modifiedProduct : updatedProduct});
    } catch (err) {
        res.status(500).json({message : err});
    }
})

//Borrar un producto
router.delete("/", verifyToken, validateIdProduct, async (req : authRequest, res) => {
    try {
        const productId : string = req.body.productId;
        const userId : string = (req.user as JwtPayload)?.id;

        //Comprobar que el usuario que quiere borrar el producto es el idCreatorUser del producto
        const usuarioCorrecto = await coleccion().findOne(
            { _id : new ObjectId(productId) }
        );

        if(usuarioCorrecto?.idCreatorUser !== userId){
            return  res.status(403).json({message : "You are not allowed to delete this product because is not yours"}); //Error 402 o 403?
        }

        const productoBorrar = await coleccion().findOne(
            {_id : new ObjectId(productId)}
        );
        const result = await coleccion().deleteOne(
            {_id : new ObjectId(productId)});

        res.status(200).json({productoBorrado : productoBorrar});
    } catch (err) {
        res.status(500).json({message : err});
    }
});

export default router;