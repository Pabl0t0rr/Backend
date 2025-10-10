# 🧠 Práctica 1 – Fundamentos de TypeScript

## 🎯 Objetivo

El objetivo es reforzar los conocimientos sobre funciones (incluyendo recursivas), algoritmos básicos, métodos de arrays como `reduce`, y el consumo de APIs externas utilizando `fetch`.

---

## 🌐 Contexto

En esta práctica, trabajarás con una API pública ([https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)) para obtener datos y realizar operaciones sobre ellos.  
Utilizaremos esta API que proporciona recursos falsos para pruebas.

---

## ⚙️ Instrucciones generales

- Crear un repositorio de GitHub para almacenar todo el código de las prácticas → [https://github.com](https://github.com)
- Usar **TypeScript** como lenguaje.
- Crear una carpeta llamada `practica-1` donde dentro contendrá **un archivo por cada ejercicio**.
- El desarrollo es **individual**.
- ❌ **No está permitido el uso de IA generativa** para resolverlo ❌ .

---

## 🧩 Ejercicio 1

Escribe una función recursiva llamada `factorialRecursivo` que tome un número entero no negativo como argumento y devuelva su factorial.  
No puedes utilizar bucles (`for`, `while`).

```
function factorialRecursivo(n: number): number {
  // Tu código aquí
}
// Ejemplo de uso:
const numero = 5;
const resultadoFactorial = factorialRecursivo(numero);
console.log(`El factorial de ${numero} es: ${resultadoFactorial}`); // Debería imprimir 120
```

## 🎬 Ejercicio 2

Escribe una función llamada `agruparPeliculasPorGenero` que tome un array de objetos representando películas  
(con propiedades como `id`, `title`, `genre_ids`) y devuelva un objeto donde las claves sean los IDs de género  
y los valores sean arrays de títulos de películas pertenecientes a ese género.

```
interface Pelicula {
  id: number;
  title: string;
  genre_ids: number[]; // Array de IDs de géneros
}

function agruparPeliculasPorGenero(peliculas: Pelicula[]): { [key: number]: string[] } {
  // Tu código aquí
}

// Ejemplo de uso (puedes crear un array de películas de prueba):
const peliculasDePrueba = [
  { id: 1, title: "Película A", genre_ids: [28, 35] },
  { id: 2, title: "Película B", genre_ids: [10749] },
  { id: 3, title: "Película C", genre_ids: [28] }
];

const peliculasAgrupadas = agruparPeliculasPorGenero(peliculasDePrueba);
console.log(peliculasAgrupadas);
// Debería imprimir un objeto con los géneros como claves y arrays de títulos como valores
```
## 🌍 Ejercicio 3

Escribe una función asíncrona llamada `obtenerTitulosDePosts` que realice las siguientes acciones:

1. Utiliza `fetch` para obtener los datos de la siguiente URL:  
   👉 https://jsonplaceholder.typicode.com/posts  
2. Maneja posibles errores durante la petición utilizando bloques `try...catch`.  
3. Extrae el título (`title`) de cada post en el array resultante.  
4. Devuelve un array con los títulos extraídos.

```
async function obtenerTitulosDePosts(): Promise<string[]> {
  // Tu código aquí
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
```

## Entrega

1. Repositorio GitHub: Entrega la URL de tu repositorio en GitHub.
2. La entrega será individual
3. Al momento de la entrega se deberá haber creado una Pull Request con los cambios
4. Ramas: Debes tener dos ramas principales:
   - develop: Contiene el código base y las últimas funcionalidades integradas.
   - feature/practica-1: Contiene la solución a los tres ejercicios de esta práctica.

## Flujo de Trabajo con Git y GitHub (Creación de una Pull Request):

Sigue estos pasos para crear una Pull Request:

    Crea la rama feature/practica-1:
```
git checkout -b feature/practica-1 develop
```
- Realiza tus cambios y commitea tu código
- Escribe el código para los ejercicios en la rama feature/practica-1.
- Commitea tus cambios con mensajes descriptivos

```
git add .
git commit -m "Implementación de Ejercicio 1"
git add .
git commit -m "Implementación de Ejercicio 2"
git add .
git commit -m "Implementación de Ejercicio 3"
```
- Sube la rama feature/practica-1 a GitHub

```
git push origin feature/practica-1
```
- Crea una Pull Request (PR)
- Ve a tu repositorio en GitHub.
- Deberías ver un mensaje que te pregunta si quieres crear una PR para la rama feature/practica-1. Haz clic en "Compare & pull request".
- Asegúrate de que la rama base sea develop y la rama comparada sea feature/practica-1.
- Escribe un título descriptivo para tu PR (por ejemplo, "Implementación de Práctica 1: Fundamentos de TypeScript").
- Describe los cambios realizados en la descripción de la PR. Explica brevemente qué has hecho y por qué.
- Haz clic en "Create pull request".
