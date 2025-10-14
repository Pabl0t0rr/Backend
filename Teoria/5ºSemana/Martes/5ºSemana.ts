import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import axios from "axios";

// Types
type Team = {
    id : number,
    name : string,
    city : string,
    titles : number
};

//Creation of the array
let teams : Team [] = [
    {id: 1, name : "Lakers", city : "Los Angeles", titles : 17},
    {id: 2, name : "Celtics", city : "Boston", titles : 17}
];

//Essential code
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Running the server :)");
})

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

// Methods
//GET Listar Equipos
app.get("/teams", (req, res) => {
    try{
        res.json(teams);
    }catch(err : any){
        res.status(500).json({error: "Error al buscar todos los equipos", details : err.message});
    } 
});

//GET MostrarEquipo por id
app.get("/teams/:id" , (req, res) => {
    try{
        const id = Number(req.params.id)   //Nos lo dara en un string
        const team = teams.find((t) => t.id === id);
        return team ? res.json(team) : res.status(404).json({error : "Equipo no encontrado"});
    }catch(err : any){
        res.status(500).json({error: "Error al buscar equipo por ID", detail : err.message});
    }
});

//POST Crear equipo nuevo
app.post("/teams", (req,res)=> {
    try{
        const newTeam : Team = {
        id : teams.length + 1,
        ...req.body,
        };

        teams.push(newTeam);
        res.status(201).json(newTeam)

    }catch(err : any ){
        res.status(500).json({error : "Error al crear el equipo ", detail : err.message})
    }  
})

//DELETE Eliminar un Equipo
app.delete("/teams/:id",(req, res) => {
    try{
        const id = Number(req.params.id);
        const exist = teams.some((t) => t.id === id)

        if(!exist){
            return res.status(404).json({error: "Equipo no encontrado para borrarlo"});
        }

        teams = teams.filter((t) => t.id !== id);
        res.json({message : "Equipo eliminado correctamente"});

    }catch (err : any){
        res.status(500).json({error : "Error al borrar un equipo mediante el ID", details : err.message});
    }
})


//Parte de AXIOS

const URL = ["http://localhost:3000/"]

const testApi =  async () => {
        
    try{
         //GET
        const urlGetTodosEquipos = URL + "teams";
        //console.log(urlGetTodosEquipos);
        
        const getTodosEquipos = (await axios.get(urlGetTodosEquipos)).data;
        
        //POST
        const urlPostCrearEquipo = URL +"teams";
        //console.log(urlPostCrearEquipo);
        
        const equipoNuevo = {
            name : "Bulls",
            city : "Chicago",
            titles : 6
        };

        
        const postCrearEquipo = (await axios.post(urlPostCrearEquipo, equipoNuevo)).data

        //GET
         const getEquiposDespuesCrear = (await axios.get(urlGetTodosEquipos)).data;
        
        //DELETE
        const urlDeleteUltimoEquipo = URL + "teams/" + postCrearEquipo.id; //Con el id del ultimo equipo añadido
        //console.log(urlDeleteUltimoEquipo);

        const deleteUltimoEquipo = (await axios.delete(urlDeleteUltimoEquipo)).data;

        //GET
        const getEquiposDespuesBorrar = (await axios.get(urlGetTodosEquipos)).data;
        return {
            getTodosEquipos,
            postCrearEquipo,
            getEquiposDespuesCrear,
            deleteUltimoEquipo,
            getEquiposDespuesBorrar
        }
    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected Error: " + err)
        }
    }
}
setTimeout(async () => {
    const prueba = await testApi();
    console.log(prueba)  
}, 1000);
