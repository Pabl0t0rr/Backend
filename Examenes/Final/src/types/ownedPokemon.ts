import { ObjectId } from "mongodb"

export type OwnedPokemon = {
_id: ObjectId,
pokemon: string,
nickname?: string,
attack: number,
defense: number,
speed: number,
special: number,
level: number
}