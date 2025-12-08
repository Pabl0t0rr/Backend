# 🧠 Práctica 2 — API REST con Express y MongoDB

## Contenido de la evaluación

En esta práctica construirás una API REST simple que permite crear, leer, actualizar y eliminar libros en una base de datos MongoDB.

### 🎯 Objetivos

Familiarizarse con:
- La definición de rutas en Express.
- El modelado y persistencia de datos con MongoDB.
- El manejo básico de errores y respuestas HTTP.

---

## ⚙️ Entrega

1. Repositorio GitHub: Entrega la URL de tu repositorio.
2. Entrega individual.
3. Pull Request: Al momento de la entrega debe existir una PR con los cambios realizados.
4. Ramas principales:
    - develop: Contiene el código base y las últimas funcionalidades integradas.
    - feature/practica-2: Contiene la solución completa a esta práctica.

---

## 🧩 Endpoints a implementar

### Crear un libro

-Path: POST /api/books  
-Body (JSON):
```json
{
  "title": "string",
  "author": "string",
  "pages": number
}
```
Response 201 (Created):
```json
{
  "_id": "60f5c2d3e1b8a12b4c9d6e7f",
  "title": "string",
  "author": "string",
  "pages": number,
  "createdAt": "2024-10-30T14:23:01.123Z",
  "updatedAt": "2024-10-30T14:23:01.123Z"
}
```
---

### Obtener todos los libros

- Path: GET /api/books  
- Body: N/A  
- Response 200 (OK):
```json
[
  {
    "_id": "60f5c2d3e1b8a12b4c9d6e7f",
    "title": "string",
    "author": "string",
    "pages": number,
    "createdAt": "2024-10-30T14:23:01.123Z",
    "updatedAt": "2024-10-30T14:23:01.123Z"
  },
  {
    "_id": "60f5c2d3e1b8a12b4c9d6e80",
    "title": "Otro libro",
    "author": "Autor X",
    "pages": 250,
    "createdAt": "2024-10-30T14:24:15.456Z",
    "updatedAt": "2024-10-30T14:24:15.456Z"
  }
]
```
---

### Actualizar un libro

- Path: PUT /api/books/:id  
- Body (JSON):
```json
{
  "title": "string",
  "author": "string",
  "pages": number
}
```
- Response 200 (OK):
```json
{
  "_id": "60f5c2d3e1b8a12b4c9d6e7f",
  "title": "string actualizado",
  "author": "autor actualizado",
  "pages": 300,
  "createdAt": "2024-10-30T14:23:01.123Z",
  "updatedAt": "2024-10-30T15:00:45.789Z"
}
```
---

### Eliminar un libro

- Path: DELETE /api/books/:id  
- Body: N/A  

- Response 200 (OK):
```json
{ "message": "Deleted successfully" }
```
---

## Instrucciones mínimas para la práctica

Implementar los cuatro endpoints (POST, GET, PUT, DELETE) exactamente como se describe en este documento.

### Validaciones básicas

- En POST y PUT, verificar que los campos obligatorios (title, author, pages) estén presentes y tengan el tipo correcto.
- Si falta algún campo o su tipo es incorrecto, devolver un error 400 Bad Request con un mensaje descriptivo.

### Manejo de errores

- 500 Internal Server Error:
  Si ocurre una excepción inesperada (p.ej., error de conexión a MongoDB), responde con:
  { "message": "Internal server error" }

- 404 Not Found:
  Cuando se solicita un recurso que no existe (GET/PUT/DELETE con un ID inválido o inexistente), responde con:
  { "message": "Not found" }

- 404 Not Found (endpoint incorrecto):
  Si se intenta acceder a un endpoint que no existe (p.ej., POST /api/book), responde con 404 Not Found.

- 400 Bad Request (JSON inválido):
  En los endpoints POST y PUT, si el cuerpo de la solicitud no es un JSON válido, responde con:
  { "message": "Invalid JSON body" }

Se recomienda usar un middleware para simplificar la validación de cuerpos JSON.