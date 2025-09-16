//Mostrar datos por consola
console.log("Hola Mundo");

//Variables Simples
let variableSimple : number = 24;
let variableBooleana : boolean = true;
const variableConstante : string = "Me llamo Pablo";

//Tipos/Clases
type Coche = {
    id : number;
    marca : string;
    cc : number;
    matricula : string
};

let ferrari : Coche = {
    id : 1212,
    marca : "Ferrari",
    cc : 567,
    matricula : "1212kjk"
};

//Interfaces
interface nombreInterfaz {
    atributo : number;
}

//Declarar funciones
    //Funcion Flecha
    const nombreFuncion = (patas : number, nombre : string) => {
        console.log("La "+ nombre + " tiene "+ patas + " patas");
    }
    nombreFuncion(4,"gallina")

//Funciones Array
// Funciones Array
const arrPrueba: number[] = [2, 6, 8, 3, 1, 10];

// ForEach en forma larga con if
arrPrueba.forEach((numero) => {
    if (true) { // aquí el if no filtra nada, solo envuelve la acción
        console.log(numero);
    }
});

// Filter en forma larga con if
const arrFunFil = arrPrueba.filter((numero) => {
    if (numero > 5) {
        return true;  // se queda en el nuevo array
    } else {
        return false; // no se queda
    }
});

console.log("Filtrados:", arrFunFil);
