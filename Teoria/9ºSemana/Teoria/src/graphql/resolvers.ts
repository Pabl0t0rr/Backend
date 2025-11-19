import { IResolvers } from "@graphql-tools/utils";


type coche = {
    id : string, 
    name : string,
    marca : string,
    modelo : string
};

const carros : coche[] = [
    {
        id: "1",
        name: "Mustang",
        marca: "Ford",
        modelo: "2020"
    },
    {
        id: "2",
        name: "Civic",
        marca: "Honda",
        modelo: "2019"
    }
];


export const resolvers : IResolvers = {
    Query: {
        getCars: () => carros,
        getCar : (_,{id}) => carros.find(car => car.id === id) 
    },
    Mutacion : {
        addCar : (_,{name, marca, modelo}) => { //Es lo mismo que params
            const newCar : coche = {
                id : String(carros.length + 1),
                name,
                marca,
                modelo
            };

            carros.push(newCar);
            return carros.find(x => x.id === String(carros.length));
        }
    }
};