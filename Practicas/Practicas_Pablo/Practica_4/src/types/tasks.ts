import { ObjectId } from "mongodb"

export type Tasks = {
    _id: ObjectId,
    title: String,
    projectId: ObjectId,
    assignedTo: string[],
    status: string,
    priority: string,
    dueDate: Date, 
}