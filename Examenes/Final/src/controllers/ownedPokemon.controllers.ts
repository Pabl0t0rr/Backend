import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { ownedPokemonsCollection, trainersCollection } from "../utils/utils";
import { OwnedPokemon } from "../types/ownedPokemon";


export const addOwnedPokemon = async (
  pokemonId: string, nickname: string, trainerId: string) => {
  const db = getDB();

  // Insertar Pokémon
  const addPokemon = await db.collection(ownedPokemonsCollection).insertOne({
    _id: new ObjectId(),
    pokemon: pokemonId,
    nickname: nickname || "",
    attack: creatorRandomValue(1, 100),
    defense: creatorRandomValue(1, 100),
    speed: creatorRandomValue(1, 100),
    special: creatorRandomValue(1, 100),
    level: creatorRandomValue(1, 100),
  });

  // Añadir referencia al entrenador
  await db.collection(trainersCollection).updateOne(
    { _id: new ObjectId(trainerId) },
    { $addToSet: { pokemons: addPokemon.insertedId} } // guardamos string
  );

  const result = await db
    .collection(ownedPokemonsCollection)
    .findOne({ _id: addPokemon.insertedId });

  return result || null;
};

export const creatorRandomValue = (min : number, max : number) => {
    return Math.floor(Math.random() * (max - min) + min);
}

export const releasePokemon = async (ownedPokemonId: string, trainerId: string) => {
  const db = getDB();

  // Borrar Pokémon de colección ownedPokemons
  await db.collection<OwnedPokemon>(ownedPokemonsCollection).deleteOne({
    _id: new ObjectId(ownedPokemonId),
  });

  // Borrar referencia de Pokémon del entrenador
  await db.collection(trainersCollection).updateOne(
    { _id: new ObjectId(trainerId) },
    { $pull: { pokemons: new ObjectId(ownedPokemonId) } } as any
  );

  // Devolver entrenador actualizado
  const trainer = await db
    .collection(trainersCollection)
    .findOne({ _id: new ObjectId(trainerId) });

  return trainer || null;
};


