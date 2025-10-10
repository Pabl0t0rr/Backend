/*
🟢 Nivel básico

Doblar números:
Dado un array de números, crea un nuevo array donde cada número esté duplicado usando map.

Filtrar pares:
Dado un array de números, devuelve solo los que sean pares usando filter.

Buscar nombre:
Dado un array de nombres, usa find para obtener el primer nombre que empiece con la letra “A” o contenga la "a".

Comprobar edades:
Dado un array de edades, usa some para saber si hay alguna persona mayor de 18 años.

Todos mayores de edad:
Dado un array de edades, usa every para comprobar si todos son mayores de 18 años.

*/
//Declaracion de variables a usar

const arrNumeros = [1,2,3,4,5,6,7,8,9,10];
const arrNombres = ["Juan", "Pablo", "Miguel", "David", "Almeria"];
const arrEdades = [2,4,18,23,14,76,99];

//Ejercicios Basicos

const arrDeDobles = arrNumeros.map((elem) => {
    return elem = elem * 2;
});
//console.log(arrDeDobles);

const arrFiltrado = arrNumeros.filter((elem) => {
    if (elem % 2 == 0){
        return elem;
    }
});
//console.log(arrFiltrado);

const buscarNombre = arrNombres.find((elem) => {
    if (elem.includes("A") || elem.includes("a")){
        return elem;
    }
});
//console.log(buscarNombre);

const comprobarEdad = arrEdades.some((elem) => elem < 18);
//console.log(comprobarEdad);

const mayoresEdad = arrEdades.every((elem) => elem > 18);
//console.log(mayoresEdad);

/*
🟡 Nivel intermedio

Suma total:
Dado un array de números, usa reduce para obtener la suma total.

Promedio:
Calcula el promedio de un array de números usando reduce.

Ordenar palabras:
Dado un array de strings, ordénalos alfabéticamente usando sort.

Eliminar duplicados:
Dado un array con valores repetidos, crea uno nuevo sin duplicados usando filter e indexOf y que ademas te muestre los numeros en orden.

Extraer nombres:
Dado un array de objetos con forma { nombre: string, edad: number }, devuelve un array solo con los nombres usando map.

*/
//Declaracion valriables
const arrRepe = [1,1,1,4,6,4,3,5,6,7];
const objeto = [
    {nombre: "Pablo", edad: 23},
    {nombre: "Juan", edad: 34},
    {nombre: "Miguel", edad: 45},
    {nombre: "David", edad: 56},
    {nombre: "Almeria", edad: 67}
];
const arrReducido = arrNumeros.reduce((acc, valorActual) => {
    acc = acc+ valorActual;
    return acc;
},0)
//console.log(arrReducido);

const arrPromdeioDif = (num : number []) => {
    if(num.length < 0){
        console.log("Array demasiado pequeño");
    }
    const suma = num.reduce((acc, valorActual)=> acc+valorActual, 0)
    const media = suma / ( num.length);
    return media;
};
//console.log(arrPromdeioDif(arrNumeros))
//Decostruir el arra para poder comparar
const ordenarPalabras = [...arrNombres].sort((a: string, b: string) => {
    return a.localeCompare(b);
}); 
//console.log(ordenarPalabras)

const eliminarRepes = arrRepe.filter((elem, index) => {
    const quitarRepes = arrRepe.indexOf(elem) === index;
    return quitarRepes;
}).sort((a : number,b : number) => {
    return a - b; // Ordena de menor a mayor
});
//console.log(eliminarRepes);

const devolverNombres = objeto.map((elem) => {
    return elem.nombre;
});
//console.log(devolverNombres);

/*
🔵 Nivel avanzado

Agrupar por edad:
Dado un array de personas con { nombre, edad }, usa reduce para crear un objeto donde las claves sean las edades y los valores sean arrays de personas de esa edad.

Contar ocurrencias:
Dado un array de palabras, usa reduce para contar cuántas veces aparece cada palabra.

Encontrar el más joven:
Dado un array de personas { nombre, edad }, usa reduce para encontrar a la persona con menor edad.

Concatenar frases:
Dado un array de strings, usa reduce para crear una sola cadena de texto separada por espacios.

Combinación de métodos:
Dado un array de productos { nombre, precio, disponible }, filtra los que estén disponibles,mapea para quedarte con los nombres,y ordénalos alfabéticamente.

*/

const agruparEdades = objeto.reduce((acc, valorActual) => {

    return acc;
});