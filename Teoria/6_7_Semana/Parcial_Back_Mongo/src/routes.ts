import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";

//Importar el middleware para las validciones
import { validateId } from "./middlewares/validateId"; //Id
import { validateDisco } from "./middlewares/validateDisco";


const router = Router();
export const coleccion = () => getDb().collection("Parcial");

//GET para mostrar todos los discos con paginación
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 2; //Limite de 2 Discos por pagina
    const skip = (page -1) * limit;
    const discos = await coleccion().find().skip(skip).limit(limit).toArray(); //Un cursor es un puntero de C pero en mongodb
    
    //Comprobar que los discos que se obtiene son del formato LD del types.ts
    const discosValidos = discos.filter(disco => {
      return disco.id && disco.filmName && disco.rotationType && disco.region && disco.lengthMinutes && disco.videoFormat;
    });

    res.json({
      info :{
        page : page,
        numberOfDiscos : limit,
        nextPage : discos.length === limit ? page +1 : null,
        previousPage : page > 1 ? page -1 : null
      },
      discosValidos
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

//GET para mostrar un disco por id
router.get("/:id",validateId, async (req, res) => {
    try {
        const idDelParametro = req.params.id;

        // Crear una sola vez el ObjectId y usarlo para las comprobaciones/consulta
        const idObjeto = new ObjectId(idDelParametro);
        const discoEncontrado = await coleccion().findOne({ _id: idObjeto });

        // Si pasa todas las comprobaciones, devolver el documento
        return res.status(200).json(discoEncontrado);
    } catch (err) {
        return res.status(400).json(err);
    }
});

//Crear un post con las validaciones basicas
router.post(`/`, validateDisco, async (req, res) => {
  try {
 
      const result = await coleccion().insertOne(req.body);
      const idMongo = result.insertedId;
      const discoCreado = await coleccion().findOne({ _id: idMongo });
      res.status(201).json(discoCreado);

  } catch (err) {
    res.status(400).json(err);
  }
});

//PUT para actualizar un disco mediante un id
router.put("/:id", validateDisco, async (req, res) => {
  try {
    const idDelParametro = req.params?.id;

        const result = await coleccion().updateOne(
      { _id: new ObjectId(idDelParametro) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

//DELETE para borrar un disco mediante un id
router.delete("/:id", validateId, async (req, res) => {
  try {
    const idDelParametro = req.params.id;

    const result = await coleccion().deleteOne({
      _id: new ObjectId(idDelParametro),
    });
    
    res.json({ result });
  } catch (err) {
    res.status(404).json(err);
  }
});

export default router;