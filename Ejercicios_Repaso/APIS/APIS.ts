//Bibliotecas para crear servidor
import express, {
type Request, 
type Response,
type NextFunction
} from "express";
import cors from "cors";

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

//RUTAS Para personajes
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

//Post crear un nuevo personaje teniendo en cuenta que le idque se le dara sera el siguiente disponible
app.post("characters", (req, res) => {
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
