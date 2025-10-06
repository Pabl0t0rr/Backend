// Que es una promesa? -> Una promesa es un objeto que representa la eventual finalización (o falla) de una operación asíncrona y su valor resultante.
// Que es un await? -> Await es una expresión que se utiliza para esperar la resolución de una promesa. Solo se puede usar dentro de funciones asíncronas. (Fachada)
// Que es un async? -> Async es una declaración que se utiliza para definir una función asíncrona, que devuelve una promesa.

import axios from "axios";

 const getCharacter = async (id : number) => {
    const personaje = await axios.get("https://rickandmortyapi.com/api/character/"+ id);
    return personaje.data;
 };
    //console.log(getCharacter(2));   


const getCharacterCorrect = async (id : number) => {
    try{
        const res = await axios.get("https://rickandmortyapi.com/api/character/" + id )
        return res.data;
    }catch (err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err);
        }
    }
};   

//const personaje = await getCharacterCorrect(1);
//console.log(personaje);

//Varias promesas 

const getCharacters = async (ids : number[] ) => {
    try{
        ids.forEach( async (x) => {
            console.log (await getCharacter(x))
        });

    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Axios error: "+ err.message);
        }else{
            console.log("Unexpected error: " + err);
        }

    }
};


const getMultipleId = async (ids :number[]) => {
    const promesa = ids.map((elem) => {
        const arrayPromesas = axios.get("https://rickandmortyapi.com/api/character/" + elem);
        return arrayPromesas;
    });

    const response = await Promise.all(promesa);
    console.log(response);
}

console.log(getMultipleId([1,2,3]));


//allSettle (promised.all(), pero con opcion de errores)

const getMultipleIdSettle = async (ids :number[]) => {
    const promesa = ids.map(async (elem) => {
        const arrayPromesas = (await axios.get("https://rickandmortyapi.com/api/character/" + elem)).data;
        return arrayPromesas;
    });

    const response = await Promise.allSettled(promesa);
    response.forEach((elem) => {
        if(elem.status == "fulfilled"){
            console.log(elem.value);
        }else{
            console.log(elem.status, " Error")
        }
    });
    console.log(response);
}

console.log(getMultipleId([1,2,3]));
