//Bibliotecas para crear servidor
import express, {
type Request, 
type Response,
type NextFunction
} from "express";
import cors from "cors";

import axios from "axios";

//Creacion del tipo LD para guardar la info

type LD = {
    id : number, 
    filmName : string,
    rotationType: "CAV" | "CLV", 
    region: string,
    lengthMinutes : number,
    videoFormat : "NTSC" | "PAL"
};

//Array con los objetos de LD
let ld_memory = [
    {id : 1, filmName : "Cars", rotationType : "CAV", region : "USA", lengthMinutes : 123, videoFormat : "NTSC"},
    {id : 2, filmName : "Cars2", rotationType : "CAV", region : "CAN", lengthMinutes : 133, videoFormat : "PAL"},
    {id : 3, filmName : "Cars3", rotationType : "CAV", region : "ITA", lengthMinutes : 56, videoFormat : "PAL"},
    {id : 4, filmName : "Cars4", rotationType : "CLV", region : "ESP", lengthMinutes : 9889, videoFormat : "NTSC"}
];

//Codigo esencial
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//RUTAS RAIZ
app.get("/", (req, res) => { //Mostramos las posibles rutas para mas facilidad
    res.json({
            LD: "http://localhost:3000/ld"
    });
});

app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
})

//RUTAS para LD
//GET Listar todos los LD
app.get("/ld" , (req, res) => {
    try{
        res.json(ld_memory);
    }catch(err : any){
        res.status(500).json({error: "Error al buscar todos los LD", details : err.message});
    }
})

//Get mostrar LD por ID
app.get("/ld/:id", (req, res)=> {
    try{
        const id = Number(req.params.id);
        const exist = ld_memory.filter((c) => c.id == id);
        return exist ? res.json(exist) : res.status(404).json({error : "Equipo no encontrado"});
    }catch(err : any){
        res.status(500).json({error: "Error al buscar un LD mediante un ID" , details : err.message});
    } 
})

//Post crear un nuevo LD teniendo en cuenta que el id  será el tamaño del array base +1
app.post("/ld", (req, res) => {
    try{
        const newLD : LD = {
            id : ld_memory.length + 1,
            ...req.body,
        };
        //Lo metemos dentro del arr original
        ld_memory.push(newLD);
        res.status(201).json(newLD);

    }catch(err : any){
        res.status(500).json({error: "Error al crear un LD" , details : err.message});    
    }
})

//Delete LD mediante id
app.delete("/ld/:id", (req,res) => {
    try{
        const id = Number(req.params.id);
        const exist = ld_memory.findIndex((i) => i.id === id);

        if(exist === -1){
            return res.status(404).json({error: "Error al intentar borrar un LD que no existe mediante el id"});
        }

        ld_memory = ld_memory.filter((c) => c.id !== id); 

        res.json({message: "LD con ID: " + id + " borrado satisfactoriamente"})

    }catch(err : any){
        res.status(500).json({error: "Error al borrar un LD medinate el ID" , details : err.message});
    }
});

const url = ["http://localhost:3000"]; //Creacion de la url para probar mediante axios

//Crecion de funcion para probar todos los metodos anteriores mediante el uso de axios
const testApi = async () => {
    const id = 1; //Modificar valor para probar otras opciones

    try {
        //Get general
        const urlGlobal = url + "/";
        const getUrlGlobal :LD[] = (await axios.get(urlGlobal + "/")).data;

        //Get todos LD
        const urlTodosLD = url + "/ld";
        const getTodos_LD :LD[] = (await axios.get(urlTodosLD)).data;

        //Post crear LD
        const newLD = {
            filmName : "Cars5", 
            rotationType : "CAV",
            region : "USA", 
            lengthMinutes : 123,
            videoFormat : "NTSC"
        }
        const urlCrearLD = urlTodosLD;
        const post_Crear_LD :LD = (await (axios.post(urlCrearLD, newLD))).data;

        //Get todos LD
        const getTodos_LD_2 :LD[] = (await axios.get(urlTodosLD)).data;

        //Delete LD medinate id
        const urlDeleteLD = urlTodosLD + "/" + id;
        const delete_LD_ID :LD = (await axios.delete(urlDeleteLD)).data;

        //Get todos LD
        const getTodos_LD_3 :LD[] = (await axios.get(urlTodosLD)).data;

        //Devolver toda la info requerida de LD  
        return {
            "🌍 URL Raíz": getUrlGlobal,
            "💿 Todos los LD (inicio)": getTodos_LD,
            "➕💿 LD creado": post_Crear_LD,
            "📋 LD totales tras creación": getTodos_LD_2,
            "❌ LD eliminado": delete_LD_ID,
            "📋 LD tras eliminación": getTodos_LD_3
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
  const pruebaLD = await testApi();
  console.log(pruebaLD);
}, 1000);//Esperamos 1 seg
