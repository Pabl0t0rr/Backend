//import basics
import { IResolvers } from "@graphql-tools/utils";
import { ObjectId } from "mongodb";
import { CourseLevel } from "../types/enums";

export const resolvers: IResolvers = {
    Query: {
        organicers:async (_, __, ctx) => {

        },

        organicer: async (_, {id}:{id: ObjectId}, ctx) => {

        },

        students: async (_, __, ctx) => {

        },

        student : async (_, __, ctx) => {

        },

        courses: async(_, __, ctx) => {

        },

        course: async(_, {id} : {id : ObjectId}, ctx) => {

        },

    },
    Mutation: {
        createStudent: async(_, {input} : {input : {name : string, email : string, password : string}}, ctx) => {

        },
        createCourse: async(_, {input} : {input : {title: string, description: string, level: CourseLevel, intructorId: ObjectId}}, ctx) => {

        },
        enrollUser: async(_, {input} : {input : {}}, ctx) => {

        },
        createReview: async(_, {input} : {input : {}}, ctx) => {

        },

    }
}