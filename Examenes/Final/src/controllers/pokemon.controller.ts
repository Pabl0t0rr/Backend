//Basics
import { ObjectId } from "mongodb";

//Imports rutas
import { getDB } from "../db/mongo";
import { pokemonsCollection } from "../utils/utils";
import { Pokemon } from "../types/pokemon";
import { PokemonType } from "../types/enum";


export const createPokemon = async (name : string, description : string, height : number, weight : number, types : PokemonType[]) => {
    const db = getDB();

    const pokemon = await db.collection<Pokemon>(pokemonsCollection).insertOne({
        _id: new ObjectId(),
        name,
        description,
        height,
        weight,
        types : []
    });
    const result = await db.collection(pokemonsCollection).findOne({_id : pokemon.insertedId});
    if(!result) return null;
    return result;
};

export const findPokemonById = async (id: string) => {
    const db = getDB();
    const existPokemon = await db.collection(pokemonsCollection).findOne({_id: new ObjectId(id)})
    return existPokemon ? existPokemon : null;
}

export const allPokemons = async (page? : number , size? : number) => {
    const db = getDB();

     page = page || 1;
     size = size || 10;

    const pokemons = await db.collection(pokemonsCollection).find().skip((page - 1) * size).limit(size).toArray();
    return pokemons
};