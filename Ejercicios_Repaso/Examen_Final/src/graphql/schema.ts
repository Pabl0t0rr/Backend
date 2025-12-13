import { gql } from "apollo-server";


export const typeDefs = gql`


type Organicer {
  _id: ID!,
  name: String!,
  role: OrganicerRole!,
  createdAt: String!
}

type Student {
  id: ID!
  name: String!
  email: String!
  password: String!
  createdAt: String!
  enrolledCourses: [Course!]!
}

type Course {
  id: ID!
  title: String!
  description: String!
  level: CourseLevel!
  createdAt: String!
  instructor: Organicer!
  students: [Student!]!
  reviews: [Review!]!
  averageRating: Float
}

type Review {
  id: ID!
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
  ORGANIZER
  REVIEWER
  TEACHER
}

input CreateOrganicerInput {
  name: String!,
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
  instructorId: ID!
}

input EnrollUserInput {
  userId: ID!
  courseId: ID!
}

input CreateReviewInput {
  rating: Int!
  comment: String
  authorId: ID!
  courseId: ID!
}


type Query {
  organicers: [Organicer!]!
  organicer(idOrganicer: ID!): Organicer

  students: [Student!]!
  student(idStudent: ID!): Student

  courses: [Course!]!
  course(idCourse: ID!): Course

  reviews: [Review!]!
  review(idReview: ID!): Review!
}

type Mutation {
  createOrganicer(input: CreateOrganicerInput!):Organicer! 
  createStudent(input: CreateStudentInput!): Student!
  createCourse(input: CreateCourseInput!): Course!
  enrollUser(input: EnrollUserInput!): Course!
  createReview(input: CreateReviewInput!): Review!
}
`