
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { courseCollection, reviewCollection } from "../utils/utils";
import { studentCollection } from "../utils/utils";

export const createReview = async (studentId : string ,rating : number,comment : string, courseId : string) => {
    const db = getDB();
    const review = await db.collection(reviewCollection).insertOne({
        rating : rating,
        comment : comment,
        createdAt : new Date().toISOString(),
        author : studentId,
        course : courseId
    });

    const updateCourse = await db.collection(courseCollection).updateOne(
        {_id : new ObjectId(courseId)},
        {$addToSet : {reviews : review.insertedId}}
);

    const result = await db.collection(reviewCollection).findOne({_id : review.insertedId});
    return result;
};

export const validUser = async (userId : string) => {
    const db = getDB();
    const student = await db.collection(studentCollection).findOne({_id : new ObjectId(userId)})
    if(!student) return null;
    
    return student ? true : false;
};

export const reviewById = async (reviewId : string) => {
    const db = getDB();
    const review = await db.collection(reviewCollection).findOne({_id : new ObjectId(reviewId)});
    return review;
};

export const allReviews= async (page : number , limit : number) => {
    const db = getDB();
    const review = await db.collection(reviewCollection).find().skip((page-1) * limit).toArray();

    return {
        info : {
            page,
            limit
        },
        results : review
    }
};
