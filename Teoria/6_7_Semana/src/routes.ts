import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";

const router = Router();
const coleccion = () => getDb().collection("Prueba_Funcionamiento");

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 2;
    const skip = (page -1) * limit;
    const personas = await coleccion().find().skip(skip).limit(limit).toArray(); //Un cursor es un puntero de C pero en mongodb
    res.json({
      info :{
        page : page,
        numberOfPeople : limit
      },
      personas
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro igual 
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const personas = await coleccion().find(
      {age : {$eq : ageQuery} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro not equal 
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const personas = await coleccion().find(
      {age : {$ne : ageQuery} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro mayor a x 
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const personas = await coleccion().find(
      {age : {$gt : ageQuery} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro mayor o igual a x 
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const personas = await coleccion().find(
      {age : {$gte : ageQuery} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro menor a x 
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const personas = await coleccion().find(
      {age : {$lt : ageQuery} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro menor o igual a x 
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const personas = await coleccion().find(
      {age : {$lte : ageQuery} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro indicando cualquiera que este dentro
router.get("/", async (req, res) => {
  try {
    const friendQuery = Number(req.query.friends);
    const friendQ2uery = Number(req.query.friends1);
    const personas = await coleccion().find(
      {friends : {$in : [friendQuery, friendQ2uery]} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro indicando cualquiera que no tenga los que les pases
router.get("/", async (req, res) => {
  try {
    const friendQuery = Number(req.query.friends);
    const friendQ2uery = Number(req.query.friends1);
    const personas = await coleccion().find(
      {friends : {$nin : [friendQuery, friendQ2uery]} }
    ).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Con un filtro indicando la edad maxima y minima y los amigos que se
router.get("/", async (req, res) => {
  try {
    const ageQuery = Number(req.query.age);
    const maxAgeQuery = Number(req.query.maxage);
    const friendQuery = Number(req.query.friends);
    const friendQ2uery = Number(req.query.friends1);
    const personas = await coleccion().find(
      {friends : {$in : [friendQuery, friendQ2uery]},
      age : {$gt : ageQuery, $lt : maxAgeQuery},
    }).toArray(); //Query es todo lo que va despues del ? en url
    res.json(personas);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/:id", async (req, res) => {
  const idDelParametro = req.params.id;
  if (idDelParametro.length == 24) {
    const personaEncontradaOno = await coleccion().findOne({
      _id: new ObjectId(idDelParametro),
    });
    personaEncontradaOno
      ? res.json(personaEncontradaOno)
      : res.status(404).json({ message: "Persona con dicho id no existe" });
  } else {
    res
      .status(404)
      .json({ message: "Id de diferente longitud a 24 caracteres" });
  }
});

router.post(`/`, async (req, res) => {
  try {
    const newName = req.body?.name;
    const newLastName = req.body?.lastName;
    if (
      newName &&
      newLastName &&
      typeof newName === "string" &&
      typeof newLastName === "string"
    ) {
      const result = await coleccion().insertOne(req.body);
      const idMongo = result.insertedId;
      const personaCreada = await coleccion().findOne({ _id: idMongo });
      res.status(201).json(personaCreada);
    } else {
      res.status(400).json({ message: "Invalid input body" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post(`/multiple`, async (req, res) => {
  try {
      const result = await coleccion().insertMany([req.body.personas]);
      res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/setAllAges", async (req, res) => {
  try {
    const result = await coleccion().updateMany(
      {},
      {
        $set: {
          age : 33,
        },
      }   
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(404).json(err)
  }
});

router.post("/setAllFriends", async (req, res) => {
  try {
    const result = await coleccion().updateMany(
      {},
      {
        $set: {
          friends : ["Paco", "Pepa", "Pepe"]
        },
      }   
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(404).json(err)
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await coleccion().updateOne(
      { _id: new ObjectId(req.params?.id) }, //Es un filtro
      { $set: req.body } //El objeto con la info actualizada
    );
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Dejar sin amigos a todos lo que tengan x edad
router.put("/noFriends/:age", async (req, res) => {
  try {
    const ageParam = Number(req.params.age)
    const result = await coleccion().updateMany({
      age : {$gte : ageParam},
    }, {
      $set : { friends : []},
    })
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await coleccion().deleteOne({
      _id: new ObjectId(req.params?.id),
    });
    
    res.json({ result });
  } catch (err) {
    res.status(404).json(err);
  }
});

router.delete("/ageEqual/:age", async (req, res) => {
  try {
    const ageParams= Number(req.params.age);
    //Antes de esto todas las comprobaciones
    const result = await coleccion().deleteMany({
      age : {$eq : ageParams}
    });
    res.json({ result });
  } catch (err) {
    res.status(404).json(err);
  }
});

export default router;