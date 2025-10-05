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
            console.log(response.data.results); //Mostramos los valores de la API teneindo en cuenta el filtro anterior
            const contenidoPersonajes = response.data.results; //Guardamos en una constante los resultados de la API
            contenidoPersonajes.map((personaje: any) => {
                console.log(`Nombre: ${personaje.name}, Estado: ${personaje.status}, Género: ${personaje.gender}`); //Mostramos los nombre de los personajes(confirmacion)
                const detalleEpisodios = personaje.episode.map((episodioURL: string) => {
                        return axios.get(episodioURL)
                            .then(episodioResponse => {
                                console.log(episodioResponse.data); // Devolvemos los datos del episodio
                            })
                            .catch(error => {
                                console.log(`Error al obtener detalles del episodio desde ${episodioURL}:`, error);
                                return null; // En caso de error, devolvemos null
                            })
                            .finally(() => {
                                console.log(`Petición finalizada para el episodio desde ${episodioURL}`);
                            });
                });
            })
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