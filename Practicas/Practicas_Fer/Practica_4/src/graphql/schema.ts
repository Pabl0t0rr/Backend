import { gql } from "apollo-server";


export const typeDefs = gql`

    type User {
        _id: ID!,
        username: String!,
        email: String!,
        password: String,
        createdAt: String,
    }

    type Post {
        _id: ID!,
        title: String!,
        content: String,
        author: User,
        createdAt: String!,
        modifiedAt: String!
    }

    type AuthPayload {
        token: String!,
        user: User!,
    }

    input RegisterInput {
        username: String!,
        email: String!,
        password: String!,
        
    }

    input LoginInput {
        username: String!,
        email: String!,
        password: String!,
    }

    input CreatePostInput {
        title: String!,
        content: String!,
    }

    input updatePostInput {
        idToUpdated: ID!,
        title: String!,
        content: String!,
    }

    input deletePostInput {
        deletedid: ID!
    }

    type Query {
       userInfo: User,
       allPost: [Post],
       postById(id: ID!): Post
    }

    type Mutation {
        register(input: RegisterInput!): AuthPayload,
        login(input: LoginInput!): AuthPayload!,
        createPost(input: CreatePostInput!): Post!,
        updatePost(input: updatePostInput!): Post!,
        deletePost(input: deletePostInput!): Boolean!,
    }

`