import { gql } from "apollo-server";


export const typeDefs = gql`


type Organicer {
  _id: ID!
  name: String!
  email: String!
  password: String!
  role: OrganicerRole!
  createdAt: String!
}

type Student {
  _id: ID!
  name: String!
  email: String!
  password: String!
  createdAt: String!
  enrolledCourses: [Course!]!
}

type Course {
  _id: ID!
  title: String!
  description: String!
  level: CourseLevel!
  createdAt: String!
  teachers: [Organicer]!
  students: [Student!]!
  reviews: [Review!]!
  averageRating: Float
}

type Review {
  _id: ID!
  rating: Int!
  comment: String
  createdAt: String!
  author: Student!
  course: Course!
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum OrganicerRole {
  ORGANICER
  TEACHER
}

input LoginUserInput {
  email: String!
  password: String!
}

input CreateOrganicerInput {
  name: String!
  email: String!
  password: String!
  role: OrganicerRole!
}

input CreateStudentInput {
  name: String!
  email: String!
  password: String!
}

input CreateCourseInput {
  title: String!
  description: String!
  level: CourseLevel!
  teachers: [ID!]!
}

input EnrollUserInput {
  courseId: ID!
}

input CreateReviewInput {
  rating: Int!
  comment: String
  courseId: ID!
}

input PaginationInput {
  page: Int = 1
  limit: Int = 10
}

type PaginationInfo {
  page: Int!
  limit: Int!
}

type OrganicerPagination {
  info: PaginationInfo!
  results: [Organicer!]!
}

type StudentPagination {
  info:  PaginationInfo!,
  results: [Student!]!
}

type CoursePagination {
  info: PaginationInfo!
  results: [Course!]!
}

type ReviewPagination{
  info: PaginationInfo,
  results: [Review!]!
}

type Query {
  organicers(input: PaginationInput = {}): OrganicerPagination!
  organicer(idOrganicer: ID!): Organicer

  students(input: PaginationInput = {}) : StudentPagination!
  student(idStudent: ID!): Student

  courses(input: PaginationInput = {}) : CoursePagination!
  course(idCourse: ID!): Course

  reviews(input: PaginationInput = {}) : ReviewPagination!
  review(idReview: ID!): Review!
  avgRating: Float!
}

type Mutation {
  createOrganicer(input: CreateOrganicerInput!):Organicer! 
  loginOrganicer(input: LoginUserInput!): String!
  createStudent(input: CreateStudentInput!): Student!
  loginStudent(input: LoginUserInput!): String!
  createCourse(input: CreateCourseInput!): Course!
  enrollStudent(input: EnrollUserInput!): Course!
  createReview(input: CreateReviewInput!): Review!
}
`