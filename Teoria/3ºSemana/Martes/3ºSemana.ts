// Creacion de API
//Usaremos una libreria quese llama axios
import axios from "axios";

//Definicion de types
type Episode = {
    id : number;
    name : string;
    air_date : string;
    episode : string;
};

type Personaje = {
    id : number;
    name : string;
    status : string;
    gender : string;
    episode : string[];
}

//Funcion que reciba name, status,gender y según estos parametros sacar el resultado de los personajes que coincidan con los datos dados
//De esos personajes queremos sacar los episodios en los que han salido y en los episodios en los que aparecen salgan los personajes que participaron

//Funcion
const getValues = (name? : string, status? : string, gender? : string) => { //? significa que el valor se puede omitir
    const URL = ["https://rickandmortyapi.com/api/character/?"];
    const URLCompleta = URL.reduce((acumulador, urlActual) => {
        if (name) {
            urlActual += `name=${name}&`;
        }
        if (status) {
            urlActual += `status=${status}&`;
        }
        if (gender) {
            urlActual += `gender=${gender}&`;
        }
        return acumulador + urlActual;
         // Concatenamos las partes de la URL
    }, ""); //Empezar poniendo un "" para los valores que nos salgan
console.log(URLCompleta);
//Realizar la peticion a la API con la URL Completa
    axios.get(URLCompleta)
        .then(response => {
            //console.log(response.data.results); //Mostramos los valores de la API teneindo en cuenta el filtro anterior
            const contenidoPersonajes = response.data.results; //Guardamos en una constante los resultados de la API para poder buscar info a posteriori
           
        })
        .catch(error => {
            console.log("Error al realizar la peticion de la API filtrada por nombre, status y gender"); //Mostramos mensaje error especifico
        })
        .finally(() => {
            console.log("Peticion finalizada"); //Finalizamos la API
        });
    }

//Llamamos a la funcion
getValues("rick", "alive", "Male");