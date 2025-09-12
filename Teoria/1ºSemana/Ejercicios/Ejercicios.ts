//Ejericico 1
/*
Crear un tipo Persona que tenga 3 variables: nombre, edad y profesion. 
Creando 5 personas en un array y mostrarlas por pantalla.
*/

type Persona = {
    nombre: string;
    edad: number;
    profesion: string;
}

const personas: Persona[] = [
    { nombre: "Juan", edad: 30, profesion: "Ingeniero" },
    { nombre: "Ana", edad: 25, profesion: "Diseñadora" },
    { nombre: "Luis", edad: 40, profesion: "Arquitecto" },
    { nombre: "Marta", edad: 35, profesion: "Abogada" },
    { nombre: "Pedro", edad: 28, profesion: "Médico" }
];

//Meter las personas en un array
const arrayPersonas : Array<Persona> = personas;

arrayPersonas.forEach(persona => {
    console.log("Nombre: " + persona.nombre + ", Edad: " + persona.edad + ", Profesión: " + persona.profesion);
});

//Ejercicio 2
/*
Crear un array de 150 numeros aleatorios entre 1-10 y que solo muestre los pares
*/
const arrayDeNumeros : number[] = Array.from({length: 150}, () => {
    return Math.floor(Math.random() * 11);
});
const arrayNumerosPares : number[] = arrayDeNumeros.filter(numero=> numero % 2 === 0);
console.log(arrayNumerosPares);
