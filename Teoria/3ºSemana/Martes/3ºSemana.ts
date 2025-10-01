// Creacion de API
//Usaremos una libreria quese llama axios
import axios from "axios";

//Funcion que reciba nme, status,gender y segun estos parametros sacar el resultado de los personajes que coincidan con los datos dados
// de los personajes mostrados queremos qu elos personajes so

//Funcion
const getValues = (name : string, status : string, gender : string) => {
    const URL = ["https://rickandmortyapi.com/api/character/?"];
    const URLCompleta = URL.reduce((acumulador, urlActual) => {
        if (name !== "") {
            urlActual += `name=${name}&`;
        }
        if (status !== "") {
            urlActual += `status=${status}&`;
        }
        if (gender !== "") {
            urlActual += `gender=${gender}&`;
        }
        return acumulador + urlActual;
         // Concatenamos las partes de la URL
    }, ""); //Empezar poniendo un "" para los valores que nos salgan
console.log(URLCompleta);
//Realizar la peticion a la API con la URL Completa
    axios.get(URLCompleta)
        .then(response => {
            console.log(response.data); //Mostramos los valores de la API teneindo en cuenta el filtro anterior
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
