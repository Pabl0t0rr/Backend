//Ejercicio Practico

import axios from "axios";

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

//Crear una funcion getEpisodeFromCharacter = asyn(id : number) y enviarlo cnd se tenga el promise.all

//Finalizar


const getEpisodeFromCharacter = (async (id? : number) => {
    try {
        const characters = (await axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`)).data; //Obtenemos la direccion del personaje con todos sus datos
        const characterEpisodeContent = characters.episode.map(async (elem) => {
            const episodesContent = (await axios.get<Episode> (elem)).data;
            return episodesContent; //Devolvemos el contenido de cada episodio al completo
        });



        const episodesPromises = await Promise.all(characterEpisodeContent);
        //Para ver cuales dan errores

        // const episodesPromises = await Promise.allSettled(characterContent);
        // episodesPromises.forEach((elem) => {
        //     if (elem.status == "fulfilled"){
        //         console.log(elem.value);
        //     }else{
        //         console.log(elem.status, "Error");
        //     }
        // });

        //Retornamos un objeto con los datos del personaje y en el apartado de episodios los datos de los episodios completos
        return {
            ...characters,
            episode: episodesPromises
        }

    } catch (err) {
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err)
        }
    }
});

const variableCompleta = await getEpisodeFromCharacter(1);
console.log(variableCompleta);
// console.log(JSON.stringify(variableCompleta, null, 2)) // Para ver el contenido de los objetos

//Crear una funcion getEpisodeFromCharacter = asyn(id : number) y enviarlo cnd se tenga el promise.all

const getEpisodeFromCharacterWorking = (async (id : number ) => {
    try{
        const URL = (await axios.get("https://rickandmortyapi.com/api/character/" + id)).data;
        const characterContents : Character = URL;
        const episodesCharacterContentPromises = characterContents.episode.map(async (elem)=> {
            const episdeInfo = (await axios.get(elem)).data;
            return episdeInfo;
        });
        
        const responseEpisodes = await Promise.all(episodesCharacterContentPromises);
        return {
            ...characterContents,
            episodesInfo : responseEpisodes
        };

    }catch (err) {
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err)
        }
    }
});

const episodiosPersonaje = await getEpisodeFromCharacterWorking(1);
//console.log(episodiosPersonaje);
