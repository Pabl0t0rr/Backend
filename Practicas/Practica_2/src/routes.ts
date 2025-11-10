import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";

const router = Router();
const coleccion = () => getDb().collection("Practica_2");

//GET todos los libros FUNCIONA
router.get("/", async (req, res) => {
  try {
    const libros = await coleccion().find().toArray();
    res.status(200).json(libros);//Codigo 200 de respuesta y el contenido
  } catch (err) {
    res.status(500).json({message : "Internal Server Error",err});
  }
});

//POST Crear un libro Funciona
router.post(`/`, async (req, res) => {
  try {
    const newTitle = req.body?.title;
    const newAuthor = req.body?.author;
    const newPages = req.body?.pages;
    if ( //Comprobaciones error
      newTitle &&
      newAuthor &&
      typeof newTitle === "string" &&
      typeof newAuthor === "string" &&
      typeof newPages === "number"
    ) {
    const newLibro = {
      title: newTitle,
      author: newAuthor,
      pages: newPages,
      createdAt: new Date(), // fecha de creación
      updatedAt : new Date()    // fecha de modificacion (si se acaba de crer es la misma)
    };
    const result = await coleccion().insertOne(newLibro);
    const idMongo = result.insertedId;
      
    const libroCreada = await coleccion().findOne({ _id: idMongo });
    res.status(201).json(libroCreada);//Codigo 201 de respusta y el contenido del libro creado
    } else { //Mensajes de error mas especificos
        const errores: string[] = [];//Guardar los parametros que falten
        if (newTitle == null) {
          errores.push("Falta 'title'");
        } else if (typeof newTitle !== "string") {
          errores.push("'title' debe de tipo string");
        }
        if (newAuthor == null) {
          errores.push("Falta 'author'");
        } else if (typeof newAuthor !== "string") {
          errores.push("'author' debe de tipo string");
        }
        if (newPages == null) {
          errores.push("Falta 'pages'");
        } else if (typeof newPages !== "number") {
          errores.push("'pages' debe ser de tipo number");
        }
        if (errores.length > 0) {
          return res.status(400).json({ message: "Datos inválidos", errors: errores });
        }
        res.status(400).json({message: "Error debido a que falta algun dato(tiltle/author/pages)"}); 
    }
  } catch (err) {
    res.status(500).json({message : "Internal Server Error",err});
  }
});

//PUT mediante id y modificar campo udpated No funciona todavia
router.put("/:id", async (req, res) => {
  try {
     //Para comprobar si existe o no el id mandado
    if(!await coleccion().findOne({ _id: new ObjectId(req.params?.id) })){
        res.status(404).json({message : "Error : ID not found"});
    }
    const newTitle = req.body?.title;
    const newAuthor = req.body?.author;
    const newPages = req.body?.pages;
    if ( //Comprobaciones error
      newTitle &&
      newAuthor &&
      typeof newTitle === "string" &&
      typeof newAuthor === "string" &&
      typeof newPages === "number"
    ) {
        const idDelParametro = req.params.id;

        //Modificamos el parametro updatedAt
        const updatedAt = new Date();
        req.body.updatedAt = updatedAt;

        const modificacion = await coleccion().updateOne( //Actualizamos el libro con el id
        { _id: new ObjectId(req.params?.id) },
        { $set: req.body }
        );

        const personaModificadaEncontrada = await coleccion().findOne(
            {
                _id: new ObjectId(idDelParametro),
            }
        );
        res.status(200).json(personaModificadaEncontrada); //Codigo 200 y mostrar el dato modificado(mostramos todos ahora mismo)
    
    } else {//Mensajes de error mas especificos
        const errores: string[] = [];//Guardar los parametros que falten
        if (newTitle == null) {
          errores.push("Falta 'title'");
        } else if (typeof newTitle !== "string") {
          errores.push("'title' debe de tipo string");
        }
        if (newAuthor == null) {
          errores.push("Falta 'author'");
        } else if (typeof newAuthor !== "string") {
          errores.push("'author' debe de tipo string");
        }
        if (newPages == null) {
          errores.push("Falta 'pages'");
        } else if (typeof newPages !== "number") {
          errores.push("'pages' debe ser de tipo number");
        }
        if (errores.length > 0) {
          return res.status(400).json({ message: "Datos inválidos", errors: errores });
        } }
    
    } catch (err) {
        res.status(500).json({message : "Internal Server Error",err});
  }
});

//DELETE de un libro por ID FUNCIONA
router.delete("/:id", async (req, res) => {
  try {
    //Para comprobar si existe o no el id mandado
    if(!await coleccion().findOne({ _id: new ObjectId(req.params?.id) })){
        res.status(404).json({message : "Error : ID not found"});
    }
    const result = await coleccion().deleteOne({
      _id: new ObjectId(req.params?.id),
    });
    res.status(200).json({ message : "Deleted succesfully" });//Codigo 200 y mostrar el libro borrado
  } catch (err) {
        res.status(500).json({message : "Internal Server Error",err});
  }
});


export default router;