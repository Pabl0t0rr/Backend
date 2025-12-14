import { ObjectId } from "mongodb"

export  type Student = {
    _id : ObjectId,
    name : string,
    email : string,
    password : string,
    createdAt : Date,
    enrolledCourses : string[]
}