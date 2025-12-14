//import basics
import { IResolvers } from "@graphql-tools/utils";
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";

//import types
import { CourseLevel, OrganicerRole } from "../types/enums";
import { Student } from "../types/student";
import { Course } from "../types/course";
import { Review } from "../types/review";

//Import controllers
import { allOrganicers, createOrganicer, duplicateEmailO, organicerById, validateOrganicer, validateOrganicerRole } from "../controllers/organicer.controllers";
import { signToken } from "../controllers/auth.controllers";
import { createStudent, duplicatedEmailS, validateStudent } from "../controllers/student.controllers";

//Import Utils
import { courseCollection, reviewCollection, studentCollection } from "../utils/utils";


export const resolvers: IResolvers = {
    Student: {
        enrolledCourses: async (parent : Student) => {
            const db = getDB();
            const listaIdsCourses = parent.enrolledCourses;
            if(!listaIdsCourses) return [];
            
            const objectIds = listaIdsCourses.map((id) => new ObjectId(id));
            return db.collection(studentCollection).find({_id : {$in : objectIds}}).toArray();
        },  
    },

    Course: {
        teachers: async(parent : Course) => {
            const db = getDB();
            const listaIdsIntructors = parent.teacher;
            if(!listaIdsIntructors) return [];

            const objectIds = listaIdsIntructors.map((id) => new ObjectId(id));
            
            return db.collection(courseCollection).find({_id : {$in : objectIds}}).toArray();;
        },

        students: async (parent : Course) => {
            const db = getDB();
            const listaIdsStudent = parent.students;
            if(!listaIdsStudent) return [];

            const objectIds = listaIdsStudent.map((id) => new ObjectId(id));
            
            return db.collection(courseCollection).find({_id : {$in : objectIds}}).toArray();
       },

       reviews: async (parent : Course) => {
            const db = getDB();
            const listaIdsReviews = parent.reviews;
            if(!listaIdsReviews)return []

            const objectIds = listaIdsReviews.map((id) => new ObjectId(id));
            return db.collection(courseCollection).find({_id :{$in : objectIds}}).toArray();
       }
    },
    
    Review: {
        author: async(parent: Review) => {
            const db = getDB();
            const author = parent.author;
            if(!author) return null;

            const objecId = new ObjectId(author);

            return await db.collection(reviewCollection).findOne({_id : objecId});
        },

        course: async(parent : Review) => {
            const db = getDB();
            const course = parent.course;
            if(!course) return null;

            const objectId = new ObjectId(course);

            return await db.collection(reviewCollection).findOne({_id : objectId});        
        }
    },

    Query: {
        organicers:async (_, {input} :{input: {page: number, limit: number}}) => {
            return allOrganicers(input.page, input.limit);
        },

        organicer: async (_, {idOrganicer}:{idOrganicer: string}) => {
            return organicerById(idOrganicer as string);
        },

        students: async (_, __) => {

        },

        student : async (_, __, ctx) => {

        },

        courses: async(_, __) => {

        },

        course: async(_, {id} : {id : string}) => {

        },

    },
    Mutation: {
        createOrganicer: async(_, {input} : {input :{name : string, email : string,password: string, role : OrganicerRole}}) => {
            //Create the organizer
            const validEmail = await duplicateEmailO(input.email);
            if(!validEmail) throw new Error("Can not use that email");
            
            const organizer =  await createOrganicer(input.name, input.email, input.password, input.role);
            if(!organizer)throw new Error("Fail to create account");

            return organizer
        },

        loginOrganicer: async(_, {input} : {input :{email: string, password: string}}) => {
            const organicer = await validateOrganicer(input.email, input.password);
            if(!organicer) throw new Error("Invalid credentials");
            
            return signToken(organicer._id.toString() as string)
        },

        createStudent: async(_, {input} : {input : {name : string, email : string, password : string}}, ctx) => {
            const user = ctx.user;
            if(!user)throw new Error("Not authenticated");

            const validUserCreate = await validateOrganicerRole(user._id);
            if(!validUserCreate) throw new Error("You can not create an student");

            const duplicated = await duplicatedEmailS(input.email);
            if(!duplicated) throw new Error("Existing email");

            const student = await createStudent(input.name, input.email,input.password)
            if(!student) throw new Error ("Fail to create an student account");

            return student;
        },

        loginStudent: async(_, {input} : {input :{email: string, password: string}}, ctx) => {
            const student = await validateStudent(input.email, input.password);
            if(!student) throw new Error("Invalid credential");

            return signToken(student._id.toString() as string);
        },

        createCourse: async(_, {input} : {input : {title: string, description: string, level: CourseLevel, intructorId: ObjectId}}, ctx) => {

        },
        enrollUser: async(_, {input} : {input : {}}, ctx) => {

        },

        createReview: async(_, {input} : {input : {}}, ctx) => {

        },

    }
}