import axios  from "axios";

type Episode = {
    id : number;
    name : string;
    air_date : string;
    episode : string;
    characters : string[]; // En la API real, characters es un array de URLs (strings)
    url: string;
    created : string;
};

type Character = {
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
}

const urlCharacter = "https://rickandmortyapi.com/api/character/";
const urlEpisodes = "https://rickandmortyapi.com/api/episode/";

/*
🟢 Nivel 1: Básico — Fetch y visualización

Listar personajes:
Crea un programa en TypeScript que obtenga la lista de personajes de la API de Rick and Morty y muestre por consola el nombre y el estado (Alive, Dead, unknown) de cada uno.

Buscar por nombre:
Pide al usuario (por consola o input HTML) un nombre y busca en la API los personajes que coincidan. Muestra los resultados con su imagen y especie.

Filtrar por estado:
Haz una función buscarPorEstado(estado: string) que devuelva solo los personajes con ese estado.
*/

const lisarPersonajes = async () => {
    try{
        const response = (await axios.get(urlCharacter)).data;
        const datosRequeridos = response.results.map((elem : Character) => {
            return {name : elem.name,
            status : elem.status    
            }
        });
        const todasPromesas = await Promise.all(datosRequeridos);
        return todasPromesas;

    }catch (err){
        if (axios.isAxiosError(err)) {
            console.error("Error en la solicitud:", err.message);
        } else {
            console.error("Error inesperado:", err);
        }
    }
}
const nlistaPersonajes = await lisarPersonajes();
//console.log(nlistaPersonajes);

const buscarNombre = async (name? : string) => {
    try{
        let urlCompleta = urlCharacter;
        if(name){
            urlCompleta = urlCharacter + "?name=" + name + "&";
        }
        
        //console.log(urlCompleta);
        const response = (await axios.get(urlCompleta)).data.results;
        const imagEspecie = response.map(async (elem : Character) => {
            return {
                name : elem.name, 
                image : elem.image,
                species : elem.species
            }
        })
        
        const namePromise = await Promise.all(imagEspecie);
        return namePromise;

    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: "+ err);
        }
    }
};
const nombrePersonajeBuscado = await buscarNombre("Rick Sanchez")
//console.log(nombrePersonajeBuscado);

const filtraEstado = async (status ? : string) => {
    try{
        let urlCompleta = urlCharacter;
        if(status){
            urlCompleta = urlCharacter + "?status="+ status + "&";
        }
        const response = (await axios.get(urlCompleta)).data.results;
        const statusData = response.filter((elem : Character) => elem.status === status);

        const statusPromise = await Promise.all(statusData);
        return statusPromise;
    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: "+ err.message);
        }else{
            console.log("Unexpected Error: " + err);
        }
    }
};
const nombresFiltrados = await filtraEstado("Alive");
//console.log(nombresFiltrados);

/*
🟡 Nivel 2: Intermedio — Manejo de múltiples endpoints

Detalles del personaje:
Al seleccionar un personaje (por su id), haz otra llamada a la API para mostrar su información completa: nombre, género, especie, origen, y la cantidad de episodios donde aparece.

Buscar episodios por nombre:
Crea una función que busque episodios por nombre (por ejemplo, “Pilot”) y muestre la fecha de emisión y los personajes que aparecen.

Combinar datos:
Muestra una lista de personajes junto con el nombre del planeta (origin.name) de donde provienen. Si el planeta no tiene nombre, muestra “Desconocido”.
*/

const detallesPersonaje = async (id? : number) => {
    try{
        let urlCompleta = urlCharacter;
        if(!id){
            throw new Error("Introduzca un id para empezar la busqueda");
        }else{
            urlCompleta += + id;
        }
        const characterInfo = (await axios.get(urlCompleta)).data;
        const contadorEpisodios =  characterInfo.episode.length;
        return {
            name : characterInfo.name,
            gender : characterInfo.gender,
            species : characterInfo.species,
            origin : characterInfo.origin.name ? characterInfo.origin.name : "Desconocido",
            episodeAppears : contadorEpisodios,
            episodes : characterInfo.episode
        };

    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err);
        }
    }
};
const contadorInfoPersonajes = await detallesPersonaje(1);
//console.log(contadorInfoPersonajes);

const findEpisodeByName = async (episode : string) => {
    try{
        let urlCompleta = urlEpisodes;
        if(!episode){
            throw new Error("Falta introducir el nombre del episodio");
        }else{
            urlCompleta += "?name=" + episode;
        }
        const episodeInfo = (await axios.get(urlCompleta)).data.results;
        return episodeInfo.map((ep : Episode) => ({
            name : ep.name,
            air_date : ep.air_date,
            characters : ep.characters
        }));

    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err);
        }
    }
}
const nombreEpisode = await findEpisodeByName("Pilot");
//console.log(nombreEpisode);

const personajesPlaneta = async () => {
    try{
        
        const infoPersonajes = (await axios.get(urlCharacter)).data.results;
        const filtradoPersonajes = infoPersonajes.map(async (elem : Character) => {
            return ({
                name: elem.name,
                namePlanet : elem.origin.name ? elem.origin.name : "Desconocido"
            });   
        });

        const returnPromise = await Promise.all(filtradoPersonajes);
        return returnPromise;

    }catch(err) {
        if(axios.isAxiosError(err)){
            console.log("Axios error" + err.message); 
        }else{
            console.log("Unexpected Error:" + err)
        }
    }
}
const listadoPersonas = await personajesPlaneta();
console.log(listadoPersonas);

/*
🔵 Nivel 3: Avanzado — Async/Await, paginación y errores

Paginación automática:
Crea una función que recorra todas las páginas de personajes y devuelva un array con todos los resultados.

Manejo de errores:🟢 Nivel 1: Básico — Fetch y visualización

    Listar personajes:
    Crea un programa en TypeScript que obtenga la lista de personajes de la API de Rick and Morty y muestre por consola el nombre y el estado (Alive, Dead, unknown) de cada uno.

    Buscar por nombre:
    Pide al usuario (por consola o input HTML) un nombre y busca en la API los personajes que coincidan. Muestra los resultados con su imagen y especie.

    Filtrar por estado:
    Haz una función buscarPorEstado(estado: string) que devuelva solo los personajes con ese estado.

🟡 Nivel 2: Intermedio — Manejo de múltiples endpoints

    Detalles del personaje:
    Al seleccionar un personaje (por su id), haz otra llamada a la API para mostrar su información completa: nombre, género, especie, origen, y la cantidad de episodios donde aparece.

    Buscar episodios por nombre:
    Crea una función que busque episodios por nombre (por ejemplo, “Pilot”) y muestre la fecha de emisión y los personajes que aparecen.

    Combinar datos:
    Muestra una lista de personajes junto con el nombre del planeta (origin.name) de donde provienen. Si el planeta no tiene nombre, muestra “Desconocido”.

🔵 Nivel 3: Avanzado — Async/Await, paginación y errores

    Paginación automática:
    Crea una función que recorra todas las páginas de personajes y devuelva un array con todos los resultados.

    Manejo de errores:
    Implementa un bloque try/catch que capture errores de red o búsquedas inválidas. Si no se encuentra ningún personaje, muestra un mensaje adecuado.

    Búsqueda múltiple:
    Permite al usuario buscar personajes, episodios y ubicaciones a la vez, mostrando los resultados clasificados por tipo (por ejemplo: “Resultados en personajes: …”, “Resultados en episodios: …”).

    Top de especies más comunes:
    Analiza todos los personajes y muestra un ranking con las 3 especies más frecuentes.

Implementa un bloque try/catch que capture errores de red o búsquedas inválidas. Si no se encuentra ningún personaje, muestra un mensaje adecuado.

Búsqueda múltiple:
Permite al usuario buscar personajes, episodios y ubicaciones a la vez, mostrando los resultados clasificados por tipo (por ejemplo: “Resultados en personajes: …”, “Resultados en episodios: …”).

Top de especies más comunes:
Analiza todos los personajes y muestra un ranking con las 3 especies más frecuentes.
*/