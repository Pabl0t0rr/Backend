import axios from 'axios';

/*
Escribe una función asíncrona llamada obtenerTitulosDePosts que realice las siguientes acciones:
    Utiliza fetch para obtener los datos de la 
    siguiente URL: https://jsonplaceholder.typicode.com/posts.
    Maneja posibles errores durante la petición utilizando bloques try...catch.
    Extrae el título (title) de cada post en el array resultante.
    Devuelve un array con los títulos extraídos.
*/    

//Cambio la forma para entenderlo mejor
const obtenerTitulosDePosts = async () => {
  // Tu código aquí
  try {
    const promise = (await axios.get("https://jsonplaceholder.typicode.com/posts")).data;
    const titles = promise.map(async (elem : { title: string }) => {
        return elem.title;
    })

    const respuestaPromesa = await Promise.all(titles);
    return respuestaPromesa;
  }catch (err){
    if (axios.isAxiosError(err)) {
      console.error(`Error en la solicitud: ${err.message}`);
    } else {
      console.error(`Error inesperado: ${err}`);
    }
  }
  
}
 
// Ejemplo de uso:
obtenerTitulosDePosts()
  .then(titulos => {
    console.log(`Títulos de los posts: ${titulos}`);
  })
  .catch(error => {
    console.error(`Error al obtener los títulos: ${error}`);
  });
 
// Ejemplo con async/await (opcional, para practicar):
async function ejecutarObtenerTitulos() {
  try {
    const titulos = await obtenerTitulosDePosts();
    console.log(`Títulos de los posts (con async/await): ${titulos}`);
  } catch (error) {
    console.error(`Error al obtener los títulos (con async/await): ${error}`);
  }
}
 
ejecutarObtenerTitulos();