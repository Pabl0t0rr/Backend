import { ObjectId } from "mongodb"

export type Review = {
    _id: ObjectId,
    rating : number,
    comment? : string,
    author : string,
    course : string
}