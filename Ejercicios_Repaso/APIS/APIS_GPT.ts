/*
🚗 Enunciado del ejercicio: “API de Conductores y Vehículos”
🎯 Objetivo

Desarrollar una API REST con Express y TypeScript que gestione información sobre conductores y vehículos, permitiendo realizar operaciones CRUD completas y aplicar filtros dinámicos para buscar registros según distintos criterios.

🧱 1. Contexto

Una pequeña empresa de transporte quiere digitalizar el control de sus empleados y su flota de vehículos.
Necesitan una API que permita:

Registrar nuevos conductores con su información personal.

Registrar vehículos, cada uno asociado (opcionalmente) a un conductor.

Consultar, actualizar y eliminar registros de ambos.

Filtrar fácilmente por parámetros como edad, marca, o nombre.
*/

import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

/*
🧩 2. Tipos de datos

Define los siguientes tipos:
type Driver = {
  id: number;
  name: string;
  age: number;
  licenseType: string; // A, B, C, D...
};

type Vehicle = {
  id: number;
  brand: string;
  model: string;
  year: number;
  driverInfo?: Driver | undefined;
};
*/

type Driver = {
    id: number,
    name : string,
    age :number,
    licenseType : string
}

type Vehicles = {
    id : number,
    brand : string,
    model:string,
    year : number,
    driverInfo? : Driver | undefined
}

/*
🚦 3. Datos iniciales

Crea algunos datos base:

Conductores
[
  { id: 1, name: "Carlos López", age: 45, licenseType: "C" },
  { id: 2, name: "Lucía Pérez", age: 32, licenseType: "B" }
]
Vehículos
[
  { id: 1, brand: "Toyota", model: "Hilux", year: 2018, driverInfo: drivers[0] },
  { id: 2, brand: "Ford", model: "Focus", year: 2021, driverInfo: drivers[1] },
  { id: 3, brand: "Renault", model: "Kangoo", year: 2015 }
]
*/

//Creacion de los objetos
let arrDrivers : Driver[] = [
  { id: 1, name: "Carlos López", age: 45, licenseType: "C" },
  { id: 2, name: "Lucía Pérez", age: 32, licenseType: "B" }
];
let arrVehicles : Vehicles[]  = [
  { id: 1, brand: "Toyota", model: "Hilux", year: 2018, driverInfo: arrDrivers[0] },
  { id: 2, brand: "Ford", model: "Focus", year: 2021, driverInfo: arrDrivers[1] },
  { id: 3, brand: "Renault", model: "Kangoo", year: 2015 }
];

/*
⚙️ 4. Endpoints requeridos
🚙 Vehículos
Método	Ruta	Descripción
GET	/vehicles	Devuelve todos los vehículos
GET	/vehicles/:id	Devuelve un vehículo por su ID
POST	/vehicles	Crea un nuevo vehículo con ID incremental
PUT	/vehicles/:id	Modifica los datos de un vehículo
DELETE	/vehicles/:id	Elimina un vehículo por ID

👨‍✈️ Conductores
Método	Ruta	Descripción
GET	/drivers	Devuelve todos los conductores
GET	/drivers/:id	Devuelve un conductor por su ID
POST	/drivers	Crea un nuevo conductor
PUT	/drivers/:id	Modifica un conductor existente
DELETE	/drivers/:id	Elimina un conductor
*/

//Rutas Generales
