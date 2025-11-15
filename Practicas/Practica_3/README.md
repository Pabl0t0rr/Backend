# Práctica 3 — API de Tienda Online con Autenticación JWT

## Objetivo

Implementar una pequeña tienda en línea que permita a los usuarios registrarse, autenticarse y gestionar productos y carritos mediante una API REST protegida con JSON Web Tokens (JWT).


### Entrega
- Repositorio GitHub: Entrega la URL de tu repositorio en GitHub.
- La entrega será individual
- Al momento de la entrega se deberá haber creado una Pull Request con los cambios
- Ramas: Debes tener dos ramas principales:
  - develop: Contiene el código base y las últimas funcionalidades integradas.
  - feature/practica-3: Contiene la solución

## Clusters a implementar

``` txt
user:
_id: ObjectId (auto‑generado)
username: String, único, requerido
email: String, único, requerido, formato email válido
passwordHash: String (hash bcrypt)
createdAt: Date (default)
 
products
_id: ObjectId
name: String, requerido
description: String, opcional
price: Number, requerido, >0
stock: Number, requerido, >=0
createdAt: Date (default)
 
carts
_id: ObjectId
userId: ObjectId (referencia a users), único por usuario
items: Array de objetos { productId, quantity }

```

## Endpoints

### 3.1 Públicos (sin JWT)

#### POST /api/auth/register

Body: { "username":"...", "email":"...", "password":"..." }

Respuesta: 201 Created con { "message":"User created" }

#### POST /api/auth/login

Body: { "email":"...", "password":"..." }

Respuesta: 200 OK con { "token":"<JWT>" }

#### GET /api/products

Body: N/A

Respuesta: 200 OK con un array de productos

### 3.2 Autenticados (requiere header Authorization: Bearer <token>)

#### POST /api/products

Body: { "name":"...", "description":"...", "price":100, "stock":10 }

Respuesta: 201 Created con el producto creado

#### PUT /api/cart/add

Body: { "productId":"<id>", "quantity":2 }

Respuesta: 200 OK con el carrito actualizado

#### GET /api/cart

Body: N/A

Respuesta: 200 OK con el contenido del carrito del usuario autenticado

### Validaciones y Manejo de Errores

Body no es JSON válido → 400 Bad Request con "Invalid JSON body"

Campos faltantes o tipo incorrecto → 400 con mensaje descriptivo

Usuario/email ya registrado → 409 Conflict con mensaje adecuado

Producto no encontrado (id inválido) → 404 Not Found con { message:"Product not found" }

Stock insuficiente al añadir al carrito → 400 con { message:"Insufficient stock" }

Token expirado/incorrecto → 401 Unauthorized con "Token inválido"

Ruta no existente (middleware catch‑all) → 404 Not Found con { message:"Not found" }
