//import basics
import { IResolvers } from "@graphql-tools/utils";
import { ObjectId } from "mongodb";

//import types
import { CourseLevel, OrganicerRole } from "../types/enums";
import { Student } from "../types/student";

//Import controllers
import { allOrganicers, createOrganicer, duplicateEmail, organicerById, validateOrganicer, validateOrganicerRole } from "../controllers/organicer.controllers";
import { signToken } from "../controllers/auth.controllers";
import { createStudent } from "../controllers/student.controllers";

export const resolvers: IResolvers = {
    Student: {
        enrolledCourses: async (parent : Student) => {

        }
    },
    
    Query: {
        organicers:async () => {
            return allOrganicers();
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
        createOrganicer: async(_, {input} : {input :{name : string, email : string,password: string, role : OrganicerRole}}, ctx) => {
            //Create the organizer
            const validEmail = await duplicateEmail(input.email);
            if(!validEmail) throw new Error("Can not use that email");
            
            const organizer =  await createOrganicer(input.name, input.email, input.password, input.role);
            if(!organizer)throw new Error("Fail to create account");

            return organizer
        },

        loginOrganicer: async(_, {input} : {input :{email: string, password: string}}, ctx) => {
            const organicer = await validateOrganicer(input.email, input.password);
            if(!organicer) throw new Error("Invalid credentials");
            return signToken(organicer._id.toString() as string)
        },

        createStudent: async(_, {input} : {input : {name : string, email : string, password : string}}, ctx) => {
            const user = ctx.user;
            if(!user)throw new Error("Not authenticated");

            const validUserCreate = await validateOrganicerRole(user._id);
            if(!validUserCreate) throw new Error("You can not create an student");

            const student = await createStudent(input.name, input.email,input.password)
            if(!student) throw new Error ("Fail to create an student account");

            return student;
        },

        loginStudent: async(_, {input} : {input :{email: string, password: string}}, ctx) => {

        },

        createCourse: async(_, {input} : {input : {title: string, description: string, level: CourseLevel, intructorId: ObjectId}}, ctx) => {

        },
        enrollUser: async(_, {input} : {input : {}}, ctx) => {

        },

        createReview: async(_, {input} : {input : {}}, ctx) => {

        },

    }
}