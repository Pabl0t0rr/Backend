import { ObjectId } from "mongodb"
import { CourseLevel } from "./enums"

export  type Course = {
    _id: ObjectId,
    title: string,
    description: string,
    level: CourseLevel,
    createdAt: Date,
    intructor: string,
    students : string [],
    reviews: string [],
    averageRating?: number
}