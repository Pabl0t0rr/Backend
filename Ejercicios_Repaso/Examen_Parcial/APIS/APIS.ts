//Bibliotecas para crear servidor
import express, {
type Request, 
type Response,
type NextFunction
} from "express";
import cors from "cors";

import axios from "axios";

//Creacion de tipos para alamacenar la info
type Character = {
    id : number,
    name : string,
    age : number,
    gender : string
};

type Animal = {
    id: number,
    name: string,
    species: string,
    age: number,
    ownerInfo?: Character | undefined //  ownerInfo puede contener la info del owner o ser undefined
}

let characters : Character[] = [
    {id: 1, name : "Juan", age : 70, gender : "Male"},
    {id: 2, name : "Miguel", age : 14, gender : "Male"}
];

let animals: Animal[] = [
    { id: 1, name: "Snuffles", species: "Dog", age: 5, ownerInfo: characters[1] },
    { id: 2, name: "Birdperson", species: "Bird", age: 40, ownerInfo: characters[0] },
    { id: 3, name: "Squanchy", species: "Cat", age: 8 }
];

//Codigo esencial
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//RUTAS RAIZ
app.get("/", (req, res) => { //Mostramos las posibles rutas para mas facilidad
    res.json({
            characters: "http://localhost:3000/characters",
            animals: "http://localhost:3000/animals"
    });
});

app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
})

//RUTAS para personajes
//GET Listar todos los personajes
app.get("/characters" , (req, res) => {
    try{
        res.json(characters);
    }catch(err : any){
        res.status(500).json({error: "Error al buscar todos los personajes", details : err.message});
    }
})

//Get mostrar Personaje por ID
app.get("/characters/:id", (req, res)=> {
    try{
        const id = Number(req.params.id);
        const exist = characters.find((c) => c.id == id);
        return exist ? res.json(exist) : res.status(500).json({error : "Persona no encontrada"});
    }catch(err : any){
        res.status(500).json({error: "Error al buscar una persona mediante un ID" , details : err.message});
    } 
})

//Post crear un nuevo personaje teniendo en cuenta que el id que sera siguiente numero
app.post("/characters", (req, res) => {
    try{
        const newCharacter : Character = {
            id : characters.length + 1,
            ...req.body,
        };
        //Lo metemos dentro del arr original
        characters.push(newCharacter);
        res.status(201).json(newCharacter);

    }catch(err : any){
        res.status(500).json({error: "Error al buscar una persona mediante un ID" , details : err.message});    
    }
})

//Put modificar un personaje
app.put("/characters/:id", (req, res) => {
    try{
        const id = Number(req.params.id);
        const exist = characters.findIndex((c) => c.id === id);
        if(exist === -1){
            return res.status(404).json({error: "No existe una persona con ese ID"});
        }
        characters[exist] = {
            ...characters[exist] ,
            ...req.body
        }
        const contador = exist +1;

        res.json({
            message : "Persona con id : " + contador + " modificada con exito",
            character : characters[exist]

        })
    }catch(err : any){
        res.status(500).json({error: "Error al modificar una persona mediante un ID" , details : err.message});
    }
});

//Delete personaje mediante id
app.delete("/characters/:id", (req,res) => {
    try{
        const id = Number(req.params.id);
        const exist = characters.findIndex((i) => i.id === id);

        if(exist === -1){
            return res.status(404).json({error: "Error al intentar borrar una persona que no existe mediante el id"});
        }

        characters = characters.filter((c) => c.id !== id); 

        res.json({message: "Personaje borrado mediante el ID: " + id + "satisfactoriamente"})

    }catch(err : any){
        res.status(500).json({error: "Error al borrar una persona medinate el ID" , details : err.message});
    }
});

//RUTAS para Animales
//Get de todos los animales
app.get("/animals" , (req, res) => {
    try{
        res.json(animals);
    }catch(err : any){
        res.status(500).json({error: "Error al buscar todos los animales", details : err.message});
    }
});

//Get de los animales con nombre = x y mostrar todos los que coincidan
app.get("/animals/:name", (req, res) => {
    try {
        const name = String(req.params.name).toLowerCase();
        const exist = animals.filter((n) => n.name.toLowerCase() === name);
        if(exist.length === 0){
            return res.status(404).json({error : "Error al buscar un animal mediante NAME"});
        }

        res.json(exist);

    } catch (err : any) {
        res.status(500).json({error : "Error al buscar un animal mediante su nombre", details : err.message});
        
    }
});
//Post crear un nuevo animal con el siguiente id y la info del primer character
app.post("/animals", (req, res) => {
    try {
        const newAnimal : Animal = {
            id : animals.length + 1,
            ...req.body,
            ownerInfo : characters[0]
        };

        animals.push(newAnimal);
        res.status(201).json(newAnimal);

    } catch (err: any) {
        res.status(500).json({error :"Error al crear un nuevo animal", details : err.message});
    }
});

//Put modificar animal mediante id
app.put("/animals/:id", (req, res) => {
    try {
        const id = Number (req.params.id);
        const exist = animals.findIndex((i) => i.id === id);

        if(exist === -1){
            return res.status(404).json({error: "No existe ningun animal con ese id"});
        }
        animals[exist] = {
            ...animals[exist],
            ...req.body
        };
        const contador = exist +1;

        res.json({
            message: "Animal con el id:" + contador + " modificado con exito",
            animal : animals[exist]
        })    
    } catch (err : any) {
        res.status(500).json({error : "Error al modificar un animal mediante un ID" , details : err.message});
    }
});

//Delete animal medinate id
app.delete("/animals/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const exist = animals.findIndex((i) => i.id === id);
        
        if(exist === -1){
            return res.status(404).json({error : "Errro al eliminar un anumal mediante el id"});
        }

        animals = animals.filter((i) => i.id !== id);

        res.json({message: "Animal con id: " + id + " borrado correctamente"});
        
    } catch (err : any) {
        res.status(500).json({error : "Error al intentar borrr un animal mediante el id", detail: err.message});
    }
});

const url = ["http://localhost:3000"];

//Crecion de funcion para probar todos los metodos anteriores mediante el uso de axios
const probarFuncionesCharacters = async () => {
     const id = 1;

    try {
        //Get general
        const urlGlobal = url + "/";
        const getUrlGlobal = (await axios.get(urlGlobal + "/")).data;

        //Get todos characters
        const urlTodosCharacters = url + "/characters";
        const getTodosCharacters = (await axios.get(urlTodosCharacters)).data;

        //Get characters por id
        const urlCharactersID = urlTodosCharacters + "/" + id;
        const getCharactersID = (await axios.get(urlCharactersID)).data;
        
        //Post crear characters
        const newCharacter = {
            name : "Alfredo", 
            age: 22,
            gender : "Male"
        };
        const urlCrearCharacter = urlTodosCharacters;
        const postCrearCharacter = (await (axios.post(urlCrearCharacter, newCharacter))).data;

        //Get todos characters
        const getTodosCharacters_2 = (await axios.get(urlTodosCharacters)).data;

        //put modificar characters
        const characterModificado = {
            name : "Juan_Modificado",
            age : 70,
            gender : "Male"
        }
        const urlModificarCharacter = urlTodosCharacters + "/" + id;
        const putModificarCharacterID = (await axios.put(urlModificarCharacter, characterModificado)).data;

        //Get todos characters
        const getTodosCharacters_3 = (await axios.get(urlTodosCharacters)).data;

        //Delete characters medinate id
        const urlDeleteCharacter = urlTodosCharacters + "/" + id;
        const deleteCharacterID = (await axios.delete(urlDeleteCharacter)).data;

        //Get todos characters
        const getTodosCharacters_4 = (await axios.get(urlTodosCharacters)).data;
        
        //Devolver toda la info de characters 
        return {
            "🌍 URL Raíz": getUrlGlobal,
            "🐕 Todos los Characters (inicio)": getTodosCharacters,
            "🔎 Character buscado por id": getCharactersID,
            "➕ Character creado": postCrearCharacter,
            "📋 Characters tras creación": getTodosCharacters_2,
            "✏️ Character modificado": putModificarCharacterID,
            "📋 Characters tras modificación": getTodosCharacters_3,
            "❌ Character eliminado": deleteCharacterID,
            "📋 Characters tras eliminación": getTodosCharacters_4
        };

    //Manejo de errores    
    } catch (err : any) {
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err.message);
        }
    }
};

//Llamada a la funcion para probar las funciones de characters
setTimeout(async () => {
  const pruebaCharacters = await probarFuncionesCharacters();
  console.log(pruebaCharacters);
}, 1000);


const probarFuncionesAnimals = async () => {
    const id = 1;
    const name = "Snuffles";
    try{
        //Get general
        const urlGlobal = url + "/";
        const getUrlGlobal = (await axios.get(urlGlobal + "/")).data;

        //Get todos animales
        const urlTodosAnimales = url + "/animals";
        const getTodosAnimales = (await axios.get(urlTodosAnimales)).data;

        //Get animales por id
        const urlAnimalesName = urlTodosAnimales + "/" + name;
        const getAnimalesName = (await axios.get(urlAnimalesName)).data;

        //Post crear animales
        const newAnimal = {
            name : "Alfredo", 
            species : "Dog",
            age: 3,
            ownerInfo : characters[0]
        };
        const urlCrearAnimal = urlTodosAnimales;
        const postCrearAnimal = (await (axios.post(urlCrearAnimal, newAnimal))).data;

        //Get todos animales
        const getTodosAnimales_2 = (await axios.get(urlTodosAnimales)).data;

        //put modificar animales
        const animalModificado = {
            name: "Snuffles_Modificado",
            species: "Dog",
            age: 5
            };

        const urlModificarAnimal = urlTodosAnimales + "/" + id;
        const putModificarAnimalID = (await axios.put(urlModificarAnimal, animalModificado)).data;

        //Get todos animales
        const getTodosAnimales_3 = (await axios.get(urlTodosAnimales)).data;

        //Delete animales medinate id
        const urlDeleteAnimal = urlTodosAnimales + "/" + id;
        const deleteAnimalID = (await axios.delete(urlDeleteAnimal)).data;

        //Get todos animales
        const getTodosAnimales_4 = (await axios.get(urlTodosAnimales)).data;

        //Devolver toda la info de animales
        return {
            "🌍 URL Raíz": getUrlGlobal,
            "🐕 Todos los animales (inicio)": getTodosAnimales,
            "🔎 Animal buscado por nombre": getAnimalesName,
            "➕ Animal creado": postCrearAnimal,
            "📋 Animales tras creación": getTodosAnimales_2,
            "✏️ Animal modificado": putModificarAnimalID,
            "📋 Animales tras modificación": getTodosAnimales_3,
            "❌ Animal eliminado": deleteAnimalID,
            "📋 Animales tras eliminación": getTodosAnimales_4
};

    //Manejo de errores    
    } catch (err : any) {
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err.message);
        }
    }
};

//Llamada a la funcion para probar las funciones de Animales
setTimeout(async () => {
  const pruebaAnimals = await probarFuncionesAnimals();
  console.log(pruebaAnimals);
}, 1000);
