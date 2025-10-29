// Creacion de API
//Usaremos una libreria quese llama axios
import axios from "axios";

//Definicion de types
//Todos los arg que se tienen de Episodio
type Episode = {
    id : number;
    name : string;
    air_date : string;
    episode : string;
    characters : string[]; // En la API real, characters es un array de URLs (strings)
    url: string;
    created : string;
};

//Todos los args que se tienen de un Personaje
type Personaje = {
    id : number;
    name : string;
    status : string;
    species : string;
    type : string;
    gender : string;
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image : string;
    episode : string[]; // En la API real, episode es un array de URLs (strings)
    url: string;
    created : string;
};
    

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
            const contenidoPersonajes : Personaje[] = response.data.results; //Guardamos en una constante los resultados de la API para poder buscar info a posteriori
            const episodiosPersonajes = contenidoPersonajes.map((i : Personaje) => {
                const urlEpisodes : string[] = i.episode; //Guardamos en una constante las URLs de los episodios
                const contEpisode = urlEpisodes.map ((url) => {
                        return axios.get(url)
                        .then(response => {
                            const episode : Episode = response.data; //Devolvemos los datos de los episodios como el type Episode
                            return episode;
                        })
                });

                return Promise.all(contEpisode).then((episodes) => { //Juntamos todas las promesas de los episodios
                    return {
                        ...i,
                        episode: episodes //Sustituimos las URLs por los objetos de los episodios
                    };
                })
            });

            Promise.all(episodiosPersonajes) //Juntamos todas las promesas de los personajes con los episodios ya resueltos
                .then((personajesConEpisodios) => {
                    console.log(personajesConEpisodios); //Para verlo como objeto
                    //console.log(JSON.stringify(personajesConEpisodios, null, 2)); //Para  mostrar el contenido que hay dentro del objeto de forma mas clara
                }); //Mostramos los personajes con los episodios ya resueltos
        })
        .catch(error => {
            console.log("Error al realizar la peticion de la API filtrada por nombre, status y gender"); //Mostramos mensaje error especifico
        })
        .finally(() => {
            console.log("Peticion finalizada"); //Finalizamos la API
        });
    }

//Llamamos a la funcion
getValues("rick sanchez", "alive", "male");
//