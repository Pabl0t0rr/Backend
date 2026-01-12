import { ObjectId } from "mongodb";

export type Trainer = {
    _id: ObjectId;
    name: string,
    password: string,
    pokemons : string []
}