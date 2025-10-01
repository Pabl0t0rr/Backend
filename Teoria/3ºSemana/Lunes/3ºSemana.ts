// Creacion de API
//Usaremos una libreria quese llama axios
import axios from "axios";

axios.get("https://rickandmortyapi.com/api/character/1")
    .then((response)=> {
        console.log(response.data);
    })
    .catch((error) => {
        console.log("Error al hacer la peticion", error.message);
    })
    .finally(() => {
        console.log("Peticion finalizada");
    });

//Para ejecutar el proyecto usamos: npm run dev
