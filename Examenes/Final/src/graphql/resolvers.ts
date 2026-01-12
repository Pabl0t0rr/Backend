//Imports basics
import { IResolvers } from "@graphql-tools/utils";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";

//Import controllers
import { signToken } from "../controllers/auth.controllers";
import { startJourney, nameExists, finddTrainerById, validateTrainer, validateUserData } from "../controllers/trainer.controllers";
import { createPokemon, allPokemons, findPokemonById } from "../controllers/pokemon.controller";
import { ownedPokemonsCollection, pokemonsCollection } from "../utils/utils";

//Import Types
import { Trainer } from "../types/trainer";
import { PokemonType } from "../types/enum";
import { OwnedPokemon } from "../types/ownedPokemon"
import { addOwnedPokemon, releasePokemon } from "../controllers/ownedPokemon.controllers";

export const resolvers: IResolvers = {
    Query: {
        //Funciona
        me: async (_, __, { user }) => {
            if(!user) throw new Error("Not authenticated");
            return finddTrainerById(user._id.toString());
        },

        //Funciona
        pokemons: (_, {page,size} : {page : number, size : number}) => {
            return allPokemons(page, size);
        },

        //Funciona
        pokemon: (_, {id} : {id : string}) => {
            return findPokemonById(id);
        },

    },

    Mutation: {
        //Funciona
        startJourney: async (_,{name, password} : {name: string, password: string} ) => {
            
            // const userValidate = validateUserData(name, password);
            // if( userValidate.length > 0 ) throw new Error(userValidate.join(" | ")) //Basic parameter validation

            const existsName= await nameExists(name);
            if(existsName) throw new Error("Name already in use");

            const userId = await startJourney(name, password);

            //If in the schema are more thing, add here
            return signToken(userId);
            },
        
        //Funciona
        login: async (_, {name, password} : {name: string, password: string, username: string} ) => {
            const user = await validateTrainer(name, password);
            if(!user) throw new Error("Invalid credentials");

             //If in the schema are more thing, add here
            return signToken(user._id.toString());
            },
  
        //Funciona
        createPokemon: async (_ , {name, description, height, weight, types} : {name : string, description : string, height : number, weight : number, types : PokemonType[]}, ctx) => {
            const user = ctx.user;
            if(!user)("Not authenticated");

            const pokemonCreate = createPokemon(name, description, height, weight, types);
            if(!pokemonCreate) throw new Error("Error creating a pokemon");

            return pokemonCreate;
            },

        //Proceso
        catchPokemon : async (_, {pokemonId, nickname} : {pokemonId : string, nickname : string}, ctx) => {
            const user = ctx.user;
            if(!user)("Not authenticated");

            const addPokemon = await addOwnedPokemon( pokemonId, nickname, user._id)
            if(!addPokemon) throw new Error("Error catching a Pokémon");

            return addPokemon;
            },

        //Proceso
        freePokemon : async (_, {ownedPokemonId} : {ownedPokemonId : string}, ctx) => {
            const user = ctx.user;
            if(!user)("Not authenticated");

            const errase = await releasePokemon(ownedPokemonId, user._id)
            if(!errase) throw new Error("Error freeing a Pokémon");
            
            return errase;    
        
        },
    },  

    Trainer: {
        pokemons: async(parent: Trainer) => {
            const db = getDB();
            const listaIdsPokemons = parent.pokemons;
            if(!listaIdsPokemons) return null;

            const objectIds = listaIdsPokemons.map((id) => new ObjectId(id));

            return await db.collection(ownedPokemonsCollection).find({_id : {$in : objectIds}}).toArray();
        }        
    },
    
    OwnedPokemon: {
        pokemon: async (parent : OwnedPokemon) => {
            const db = getDB();
            const pokemon = parent.pokemon;
            if(!pokemon) return null;

            const objecId = new ObjectId(pokemon);

            return await db.collection(pokemonsCollection).findOne({_id : objecId});
        },  
    },
}