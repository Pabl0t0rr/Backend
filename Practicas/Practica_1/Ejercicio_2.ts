type Pelicula = {
  id: number;
  title: string;
  genre_ids: number[]; // Array de IDs de géneros
}
 
/*
Escribe una función llamada agruparPeliculasPorGenero que tome un array de objetos representando películas (con propiedades como id, title, genre_ids) 
y devuelva un objeto donde las claves sean los IDs de género y los valores sean arrays de títulos de películas pertenecientes a ese género.
*/
const  agruparPeliculasPorGenero = (peliculas: Pelicula[]) : { [key: number]: string[] } => {
  // Tu código aquí
  const resultado = peliculas.reduce((acc, pelicula) => {
    pelicula.genre_ids.forEach((elem)=>{
        if(!acc[elem]){ //Caso en el que no exista
            acc[elem] = [pelicula.title];
        }else{
            acc[elem].push(pelicula.title); //Añado contenido al array
        }
    });

    return acc;

  },{} as { [key: number]: string[] });  //Para inicializar el diccionario

  return resultado;
}
 
// Ejemplo de uso (puedes crear un array de películas de prueba):
const peliculasDePrueba = [
    { id: 1, title: "Película A", genre_ids: [28, 35] },
    { id: 2, title: "Película B", genre_ids: [10749] },
    { id: 3, title: "Película C", genre_ids: [28] }
];
 
const peliculasAgrupadas = agruparPeliculasPorGenero(peliculasDePrueba);
console.log(peliculasAgrupadas); // Debería imprimir un objeto con los géneros como claves y arrays de títulos como valores