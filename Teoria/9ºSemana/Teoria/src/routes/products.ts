import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../mongo";

//Import middlewares
import { authRequest,verifyToken } from "../middlewares/verifyToken";
import { validateProduct } from "../middlewares/validateProduct";

const router = Router();

type Product = {
  _id?: ObjectId;
  idCreatorUser:number;
  idsBuyer: string[]; //Le pasaremos el id de los users
  name: string;
  description: string;
};

const coleccionProducts = process.env.COLLECTION_NAME_P;
export const coleccion = () => getDb().collection<Product>(coleccionProducts as string);

//Obtener los productos (con filtro dependiendo de valores introducidos)
router.get("/", async (req, res) => {
    try {
        const {idCreatorUser, idsBuyer, name, description } = req.query;
        const filter  = [];
        if (idCreatorUser) filter.push({idCreatorUser : Number (idCreatorUser)});
        if(idsBuyer) filter.push({idsBuyer : ObjectId})
        if(name)filter.push({name : name.toString().toLowerCase()})  
        if(description) filter.push({description : description.toString().toLowerCase()})        
   
        const productFiltro = filter.length > 0 ? {$and : filter} : {};
        const resultados = await coleccion().find(productFiltro).toArray();
        res.status(200).json(resultados);

    } catch (err) {
        res.status(404).json({message: err});
    }
})

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
})

//Modificar un producto
router.put("/", verifyToken, validateProduct, async (req : authRequest, res) => {
    try {
        
    } catch (err) {
        res.status(500).json({mesnaje : err});
    }
})
export default router;