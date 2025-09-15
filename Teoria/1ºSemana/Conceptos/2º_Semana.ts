//Repaso clase anterior

//Crear un tipo Marca y Prenda con (id, nombre y marca en prenda)
//Funcion que reciva una prenda y devuelva su marca

type Marca = {
    id : number;
    nombre : string;
};

type Prenda = {
    id : number;
    nombre : string;
    marca : Marca;
};

type camiseta = {
    id : 1;
    nombre : "Camiseta blanca";
    marca : "HyM";
};
const devolverMarca = (prenda : Prenda) : Marca => {
    return prenda.marca;
}

const arrayPrueba: number[] = [1,2,3,4,5,6,7,8,9,10];
//Recorrerlo y devolverlo con el doble del valor que hay en cada posicion con map
const arrayDoble : number [] = arrayPrueba.map((num) => num * 2);
//console.log(arrayDoble);


//Ejercicio 1
//Teniendo una prenda queremos devolver la marca de la posicion en la qu eeste prenda se encuentra en un array de prendas

const arrayPrendas : Prenda[] = [{id : 1, nombre : "Camiseta blanca", marca : {id : 1, nombre : "HyM"}},
                                {id : 2, nombre : "Camiseta negra", marca : {id : 2, nombre : "Zara"}},
                                {id : 3, nombre : "Camiseta roja", marca : {id : 3, nombre : "Pull&Bear"}}
];

const devolverMarcaArray = (arrayPrenda :Prenda []) : Marca => {
    const prendaMap = arrayPrenda.map((prenda) => prenda.marca);
    return prendaMap[0];
};
//console.log(devolverMarcaArray(arrayPrendas));


//Ejercicio 2
//Hacer un array de numeros y devolver un array con los multiplos de 2 y de 5
const arrayNumeros : number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
const arrayMultiplos : number [] = arrayNumeros.filter((num ) => num %2=== 0 && num %5 ===0);
console.log(arrayMultiplos);
