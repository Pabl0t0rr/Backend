import { gql } from "apollo-server";


export const typeDefs = gql`

    type User {
        _id: ID!,
        username: String!,
        email: String!,
        password: String,
        createdAt: String,
    }

    type Projects {
        _id: ID!,
        name: String!,
        description: String,
        startDate: String!,
        endDate: String!,
        owner: User!,
        members: [User]! ,
        tasks: [Tasks]!,

    }

    type Tasks {
        _id: ID!,
        title: String!,
        projectId: Projects,
        assignedTo: User!,
        status: String!,
        priority: String!,
        dueDate: String, 
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

    input CreateProjectInput {
        name: String!,
        description: String,
        startDate: String!,
        endDate: String!,
        members: [ID]! ,
        tasks: [ID]!,
    }

    input updateProjectInput {
        name: String,
        description: String,
        startDate: String,
        endDate: String,
        members: [ID],
        tasks: [ID]
    }
    
    input CreateTaskInput {
        title: String!,
        assignedTo: [ID]!,
        status: String!,
        priority: String!,
        dueDate: String,
    }

    input UpdateTaskInput {
        status: String
    }

    type Query {
        myProjects: [ID]!,
        projectDetails(id: ID!): [Projects]!,
        users: [ID]!
    }

    type Mutation {
        register(input: RegisterInput!): AuthPayload,
        login(input: LoginInput!): AuthPayload!,
        createProject(input: CreateProjectInput!): Projects!,
        updateProject(id: ID!, input: updateProjectInput!): Projects!,
        addMember(projectId: ID!, userId: ID!): Projects!,
        createTask(projectId: ID!, input: CreateTaskInput!): Tasks!,
        updateTaskStatus(taskId: ID!, status: UpdateTaskInput!): Tasks!,
        deleteProject(id: ID!): Boolean!,
    }

`