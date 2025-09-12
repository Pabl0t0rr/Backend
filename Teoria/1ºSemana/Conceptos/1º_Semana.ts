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
const arrFun : number [] = []
    //ForEach
    arrFun.forEach(numero => {console.log(numero);
    }); 
    //Filter
    const arrFunFil = arrFun.filter(numero => numero > 5);
    