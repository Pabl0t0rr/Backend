//Crear una funcion que se llame getCharacterName pasandole un array de numeros, pra que nos devuelva un string de arrays con los nombres de los personajes
import axios from "axios";

const getCharacterName = async (id : number []) => {
    try{
        const promesa = id.map(async (elem) => {
            const arrayPromesasNombre = (await axios.get("https://rickandmortyapi.com/api/character/" + elem)).data.name;

            return arrayPromesasNombre;
        });    

    const response = await Promise.all(promesa);
    console.log(response);

    }catch(err){ //Para manejar cualquier error
        if(axios.isAxiosError(err)){
            console.log("Axios error: " + err.message);
        }else{
            console.log("Unexpected error: " + err);
        }       
    }

};

getCharacterName([1,2,3,4,5]);