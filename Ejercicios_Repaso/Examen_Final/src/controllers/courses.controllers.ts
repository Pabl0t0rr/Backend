import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { CourseLevel } from "../types/enums";
import { courseCollection, studentCollection } from "../utils/utils";


export const createCourse = async (title : string, description : string, level : CourseLevel, teachers: string []) => {
    const db = getDB();

    const course = await db.collection(courseCollection).insertOne({
        title,
        description,
        level,
        createdAt : new Date().toISOString(),
        teachers : teachers,
        students : [],
        reviews : [],
        averageRating : 0.0 
    })

    const result = await db.collection(courseCollection).findOne({_id : course.insertedId});
    if(!result) return null;
    return result;
};

export const allCourses = async (page : number , limit : number) => {
    const db = getDB();
    const courses = await db.collection(courseCollection).find().skip((page - 1) * limit).limit(limit).toArray();
    return {
        info : {
            page,
            limit
        },
        results: courses
    };
};

export const courseById = async (idCourse : string) => {
    const db = getDB();
    const course = await db.collection(courseCollection).findOne({_id : new ObjectId(idCourse)});
    return course;
}

export const enrolledStudentCourses = async (idStudent : string, courseId : string) => {
    const db = getDB();
    const updatedCourse = await db.collection(courseCollection).updateOne(
        {_id : new ObjectId(courseId)},
        {$addToSet : { students : idStudent}});

    const updatedStudent = await db.collection(studentCollection).updateOne(
        {_id : new ObjectId(idStudent)},
        {$addToSet: {enrolledCourses : courseId}});

     const result = await db.collection(courseCollection).findOne({_id : new ObjectId(courseId)});   
    return result;

};
