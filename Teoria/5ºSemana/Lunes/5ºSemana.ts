// Biblioteca express para crear el servidor
import express from 'express';
import cors from 'cors';

/*
Tipos API
get()-> dar info
post() -> crear info
put() -> actualiza info
delete() -> borrar info
*/

type Calle = {
    numero : number,
    streetName : string,
    floor : number
};

type Persona = {
    id : string, 
    name: string,
    email: string,
    calle : Calle
};

let personas  : Persona [] = [
    {
    id : "1",
    name : "Pablo",
    email: "prueba@gmail.com",
    calle : {
        floor : 1,
        numero : 11,
        streetName : "Calle de prueba"
    }
    },
    {
    id : "2",
    name : "Juan",
    email: "prueba@gmail.com",
    calle : {
        floor : 2,
        numero : 22,
        streetName : "Calle de prueba"
    }
    }
]


const appServer = express();
const port = 3000;

//Para ejecutarlo
//localhost+port (Navegador)
//Definir lo que usaremos en el programa
appServer.use(cors());
appServer.use(express.json())

//GET

//Definimos la llamada (se puede poner las rutas disponibles de la API)
appServer.get("/", (req, res) => {
    res.send("Te has conectado")
});

//Definimos ruta de las personas
appServer.get("/personas", (req, res) => {
    res.json(personas);
});

//POST
appServer.post("/personas", (req, res) => { //Cnd lo mandamos en postman hay que decirle que use el raw fromato JSON

    const nameNewUser = req.body.name;
    if(nameNewUser){ //Comprobaciones de todas las variables que tiene nuestro tipo(error mandar al error 404)

    }
    const newUser : Persona = {
        id : Date.now().toString(),
        ...req.body
    };
    personas.push(newUser); //Lo añadimos
    res.status(201).json(newUser);
    //res.status(404).send("Mal tipado")
});

//PUT
appServer.put("/personas/:id", (req, res)=>{
    const id = req.params.id; //Siempre sera un string lo que se pasa por parametros
    const personasNuevas = personas.map((persona) => { //Recorremos el array y si coincide el id lo actualizamos
        return persona.id === id ? {...persona, ...req.body} : persona;
    });
    personas = personasNuevas;
    res.json({message: "Personas actualizadas"});
});

//DELETE
appServer.delete("/personas/:id", (req, res) => {
    const id = req.params.id;
    const personasSinEliminada = personas.filter(p => ! (p.id === id));
    personas = personasSinEliminada;
    res.json({message : "Persona eliminada"});
});

//Para ejecutarlo
appServer.listen(port, () => {
    console.log("Server started at : " + port);

});



