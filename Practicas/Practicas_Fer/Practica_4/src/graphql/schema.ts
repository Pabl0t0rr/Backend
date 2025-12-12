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
        author: ID!,
        createdAt: String,
        updatedAt: String
    }

    type Register {
        token: String!,
        userInfo: User!
    }

    type Query {
       userInfo: User,
       allPost: [Post],
       postById(id: ID!): Post
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): Register!,
        login(email: String!, password: String!, username: String!): String!,
        createPost(title: String!, content: String): Post!,
        updatePost(idPost: ID!,title: String!, content: String): Post!,
        deletePost(idPost: ID!): Boolean!,
    }

`