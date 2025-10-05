
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
console.log(devolverMarcaArray(arrayPrendas));


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
//console.log(arrayEvery);


// Ejercicio 6 
// Teniendo un array de strings, separar las palabras medinate un ;
// Reduce
const arrayStrings : string[] = ["Hola","Mundo","Feliz"];
const inicialValueString : string = " ";

const separarPalabras = arrayStrings.reduce((acumulador : string, valorInicial : string) => {
    if(acumulador === " "){
    return valorInicial;
    } else {
    return acumulador + ";" + valorInicial;
    }
},inicialValueString);
//console.log(separarPalabras);

//Ejercicio 7
//Teniendo un typecliente, que tiene seccionCompra y nombre, hcer un array Clientes y con un reduce devolver 2 arrays, uno con los clientes de alimentacion y otro con los de farmacia

type Cliente = {
    seccionCompra: string;
    nombre : string;
};

//Declarar las personas
let Pablo : Cliente = {seccionCompra : "alimentacion", nombre : "Pablo"};
let Maria : Cliente = {seccionCompra : "farmacia", nombre : "Maria"};
let Lucia : Cliente = {seccionCompra : "alimentacion", nombre : "Lucia"};
let Juan : Cliente = {seccionCompra : "farmacia", nombre : "Juan"};

const arrayClientes : Cliente[] = [Pablo,Maria,Lucia,Juan];

type Resultado = {
    Alimentacion : Cliente[],
    Farmacia : Cliente[];
};

const inicialValueResultado : Resultado = {
    Alimentacion : [],
    Farmacia : []
};

const filtrados   = arrayClientes.reduce((acumulador : Resultado, valorActual : Cliente) => {
    if(valorActual.seccionCompra === "alimentacion"){
        acumulador.Alimentacion.push(valorActual);
    } else if (valorActual.seccionCompra === "farmacia"){
        acumulador.Farmacia.push(valorActual);
    }
    return acumulador;

},inicialValueResultado);
//console.log(filtrados);