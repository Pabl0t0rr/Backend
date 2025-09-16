
// Definiciones
type Marca = {
    id : number;
    nombre : string;
};

type Prenda = {
    id : number;
    nombre : string;
    marca : Marca;
};

// Ejercicio 1
// Teniendo una prenda, queremos devolver la marca de la posición
// en la que esté dentro de un array de prendas
const arrayPrendas: Prenda[] = [
    {id : 1, nombre : "Camiseta blanca", marca : {id : 1, nombre : "HyM"}},
    {id : 2, nombre : "Camiseta negra", marca : {id : 2, nombre : "Zara"}},
    {id : 3, nombre : "Camiseta roja", marca : {id : 3, nombre : "Pull&Bear"}}
];

const devolverMarcaArray = (arrayPrenda: Prenda[]): Marca[] => {
    return arrayPrenda.map(prenda => prenda.marca);
};
 //console.log(devolverMarcaArray(arrayPrendas));


// Ejercicio 2, 3, 4, 5 
// Array de números → devolver múltiplos de 2 y 5
const arrayNumeros: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

// Filter
const arrayMultiplos: number[] = arrayNumeros.filter(num => num % 2 === 0 && num % 5 === 0);
//console.log(arrayMultiplos);


// Find
const arrayFind: number | undefined = arrayNumeros.find(num => num % 2 === 0 && num % 5 === 0);
//console.log(arrayFind);


// Some
const arraySome: boolean = arrayNumeros.some(num => num % 2 === 0 && num % 5 === 0);
//console.log(arraySome);


// Every
const arrayEvery: boolean = arrayNumeros.every(num => num % 2 === 0 && num % 5 === 0);
console.log(arrayEvery);
