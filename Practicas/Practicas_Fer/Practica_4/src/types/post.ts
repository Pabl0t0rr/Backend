import { ObjectId } from "mongodb"

export type Post = {
    _id : ObjectId,
    title : string,
    content : string,
    author: string,
    createdAt: Date,
    updatedAt: Date
}