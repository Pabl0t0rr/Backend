const arrayPrueba: number[] = [1, 2, 3, 4, 5];

// .map() → recorre el array y transforma cada valor
const arrayDoble: number[] = arrayPrueba.map(num => {
    let resultado = 0;
    // multiplicamos por 2
    if (true) {  // aquí no hay condición, simplemente aplicamos una operación
        resultado = num * 2;
    }
    return resultado;
});
// Resultado: [2, 4, 6, 8, 10]


// .filter() → devuelve los valores que cumplen una condición
const multiplosDe2: number[] = arrayPrueba.filter(num => {
    if (num % 2 === 0) {   // si es múltiplo de 2
        return true;       // lo dejamos en el array
    } else {
        return false;      // lo descartamos
    }
});
// Resultado: [2, 4]


// .find() → devuelve el primer valor que cumpla la condición
const primerMultiploDe2: number | undefined = arrayPrueba.find(num => {
    if (num % 2 === 0) {   // si es múltiplo de 2
        return true;       // devuelve este y se detiene
    } else {
        return false;      // sigue buscando
    }
});
// Resultado: 2


// .some() → devuelve true si al menos UN valor cumple la condición
const hayMultiploDe3: boolean = arrayPrueba.some(num => {
    if (num % 3 === 0) {   // si es múltiplo de 3
        return true;       // ya no hace falta seguir
    } else {
        return false;      // sigue buscando
    }
});
// Resultado: true


// .every() → devuelve true si TODOS los valores cumplen la condición
const todosMayoresQue0: boolean = arrayPrueba.every(num => {
    if (num > 0) {         // si es mayor que 0
        return true;       // seguimos comprobando
    } else {
        return false;      // si alguno no cumple → false
    }
});
// Resultado: true
