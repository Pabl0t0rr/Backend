//Imports basics
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { IResolvers } from "@graphql-tools/utils";

//Import types
import { Projects } from "../types/projects";
import { User } from "../types/users";
import { Tasks } from "../types/tasks";

//Import utils
import { createUser, validateUser } from "../utils/users";
import { signToken } from "../utils/auth";
import { validatePriority, validateSatus } from "../utils/tasks";
import { validateDate } from "../utils/projects";

//Import environment variables
import dotenv from "dotenv";



dotenv.config();

export const resolvers: IResolvers = {
    Query: {
       
        //Devolvera los projectos dnd el usuario que se pasa es owner o member 
       myProjects: async (_, __, ctx) => {
        const user = ctx.user;
        if(!user) throw new Error("Not authenticated");

        const db = getDB();
        //Mostrar ids proyectso del usuario que se pasa es owner o member
        const projects = await db
            .collection<Projects>(process.env.COLLECTION_NAME_P as string)
            .find({
                $or: [
                    { owner: user._id.toString() },
                    { members: user._id.toString() }]
                })
            .toArray();
        if(projects.length === 0) {
            throw new Error("No projects found for this user");
        }

        return projects.map((project) => project._id.toString());

       },
       
       //Devuelve el contenido conmpleto del ID del proyecto que se ha puesto
       projectDetails: async(_, {id} : {id: string}, ctx) => {
        const user = ctx.user;
        if(!user) throw new Error("Not authenticated");
        
        const db = getDB();

        const validId = await db
            .collection<Projects>(process.env.COLLECTION_NAME_P as string)
            .findOne({ _id: new ObjectId(id) });
            
        if(!validId) throw new Error("Project not found");

        return await db.collection<Projects>(process.env.COLLECTION_NAME_P!).find({ _id: new ObjectId(id) }).toArray();
       },

       //Devuelve una lista de usuarios para poder buscarlos
       users: async(_, __, ctx) => {
        const user = ctx.user;
        if(!user) throw new Error("Not authenticated");

        const db = getDB();

        //Solo hay que devolver el array de IDS
        const users = await db.collection<User>(process.env.COLLECTION_NAME_U!).find().toArray();
        
        return users.map((user) => user._id.toString());
        }
    },

    Projects: {
        owner: async (parent: Projects) => {
            const db = getDB();
            const owner = parent.owner;
            return db
            .collection<User>(process.env.COLLECTION_NAME_U as string)
            .findOne({_id : new ObjectId(owner)}) as Promise<User>;
        },
        members: async(parent: Projects) => {
            const db = getDB();
            const listaIdsMembers = parent.members;
            const objectIds = await listaIdsMembers.map((id) => new ObjectId(id));
            return db
                .collection(process.env.COLLECTION_NAME_U as string)
                .find({ _id: { $in: objectIds } })
                .toArray();
        },
        tasks: async(parent : Projects) => {
            const db = getDB();
            const listaIdsTareas = parent.tasks;
            const objectIds = await listaIdsTareas.map((id) => new ObjectId(id));
            return db
                .collection(process.env.COLLECTION_NAME_T as string)
                .find({_id : {$in: objectIds}})
                .toArray();
        }
    },

    Tasks: {
        projectId: async (parent: Tasks) => {
            const db = getDB();
            const listaIDProject = parent.projectId;
            return db   
                .collection(process.env.COLLECTION_NAME_P as string)
                .findOne({_id: listaIDProject})
        },

        assignedTo: async(parent : Tasks) => {
            const db = getDB();
            const listaIdUsers = parent.assignedTo;
            const objectId = await listaIdUsers.map((id) => new ObjectId(id as string));
            return db 
                .collection(process.env.COLLECTION_NAME_U as string)
                .findOne({_id: {$in: objectId}})
            }
    },

    Mutation: {
        //Funciona
        register: async (_,{input} : {input: {email: string, password: string, username: string}} ) => {
            console.log("Registering user:", input.email);
            const user = await createUser(input.email, input.password, input.username);
            return {
                token: signToken(user._id.toString()),
                user,
            }
        },

        //Funciona
        login: async (_, {input} : {input: {email: string, password: string, username: string}} ) => {
            const user = await validateUser(input.email, input.password, input.username);
            if(!user) throw new Error("Invalid credentials");
            return {
                token: signToken(user._id.toString()),
                user,
            }
        },

        //Funciona
        createProject: async (_, {input} : {input: {name: string, description?: string, startDate: string, endDate: string, members: string[], tasks: string[]}}, ctx ) => {
             const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            const db = getDB();

            //Validaciones fecha
            const { startDate, endDate } = validateDate(input.startDate, input.endDate);
            
            const result = await db.collection<Projects>(process.env.COLLECTION_NAME_P!).insertOne({
                _id : new ObjectId(),
                name: input.name,
                description: input.description || "",
                startDate: startDate,
                endDate: endDate,
                owner : user._id.toString(),
                members: input.members.map(id => id.toString()),
                tasks: input.tasks.map(id => id.toString())
            });

            //Mostralo
            return await db
                .collection<Projects>(process.env.COLLECTION_NAME_P!)
                .findOne({ _id: result.insertedId });
        },

        //Funciona
        updateProject: async(_, {id, input} : {id : string, input: {name?: string, description?: string, startDate?: string, endDate?: string, members?: string[], tasks?: string[]}}, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
    
            const db = getDB();
            //Comporbacion que el token recivido es el owner del proyecto
            const project = await db
                .collection<Projects>(process.env.COLLECTION_NAME_P as string)
                .findOne({ _id: new ObjectId(id) });
            if(!project) throw new Error("Project not found");
            if(project.owner !== user._id.toString()) throw new Error("Not authorized to update this project");
    
            //Validacines fechas
            let startDate = project.startDate;
            let endDate = project.endDate;

            if (input.startDate || input.endDate) {
                const validatedDates = validateDate(
                input.startDate || project.startDate.toISOString(),
                input.endDate || project.endDate.toISOString()
                );
                startDate = validatedDates.startDate;
                endDate = validatedDates.endDate;
            }
            
            await db.collection<Projects>(process.env.COLLECTION_NAME_P as string).updateOne (
                { _id: new ObjectId(id) },
                { $set: {
                    name: input.name || project.name,
                    description: input.description || project.description,
                    startDate: startDate,
                    endDate: endDate,
                    members: input.members ? input.members.map(id => id.toString()) : project.members,
                    tasks: input.tasks ? input.tasks.map(id => id.toString()) : project.tasks,
                }});
            
            //Mostralo
            return await db
                .collection<Projects>(process.env.COLLECTION_NAME_P!)
                .findOne({_id: new ObjectId(id)});
        },

        //Funciona
        addMember: async(_, {projectId, userId} : {projectId: string, userId: string}, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");

             const db = getDB();
            //Comporbacion que el token recivido es el owner del proyecto
            const project = await db
                .collection<Projects>(process.env.COLLECTION_NAME_P!)
                .findOne({ _id: new ObjectId(projectId) });
            if(!project) throw new Error("Project not found");
            if(project.owner !== user._id.toString()) throw new Error("Not authorized to update this project");
        
            await db.collection<Projects>(process.env.COLLECTION_NAME_P!).updateOne(
                { _id: new ObjectId(projectId) },
                { $addToSet: { members: userId.toString() } }
            );

            return await db
                .collection<Projects>(process.env.COLLECTION_NAME_P!)
                .findOne({ _id: new ObjectId(projectId) });
        },

        //Funciona
        createTask: async(_, {projectId, input} : {projectId: string, input: {title: string, assignedTo: string[], status: string, priority: string, dueDate: string}}, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            const db = getDB();
            //Comporbacion que el token recivido es el owner del proyecto o un miembro
            const project = await db
                .collection<Projects>(process.env.COLLECTION_NAME_P!)
                .findOne({ _id: new ObjectId(projectId) });
            if(!project) throw new Error("Project not found");
            if(project.owner !== user._id.toString() && !project.members.includes(user._id.toString())) throw new Error("Not authorized to update this project");
        
            //Validaciones previas
            const newStatus = validateSatus(input.status);
            const newPriority = validatePriority(input.priority);

            //Crear la tarea
            const result = await db.collection<Tasks>(process.env.COLLECTION_NAME_T as string).insertOne({
                _id: new ObjectId(),
                title: input.title,
                projectId: new ObjectId(projectId),
                assignedTo: input.assignedTo.map((id) => id.toString()),
                status: newStatus,
                priority: newPriority,
                dueDate: new Date(input.dueDate)
            })

            //Actualizar el proyecto con el id de la tarea
            const actuProject = await db
            .collection<Projects>(process.env.COLLECTION_NAME_P as string)
            .updateOne( 
                {_id: new ObjectId(projectId) },
                {$set: {tasks: [...project.tasks, result.insertedId.toString()] }}
            )

            //Mostrarlo
            return await db
                .collection<Tasks>(process.env.COLLECTION_NAME_T as string)
                .findOne({ _id: result.insertedId });
        },    

        //Funciona
        updateTaskStatus: async(_, {taskId, status} : {taskId: string, status: {status: string}}, ctx) => {
             const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            const db = getDB();
            //comprobr que sean miemnros de la task
            const task = await db.collection<Tasks>(process.env.COLLECTION_NAME_T as string).findOne({ _id: new ObjectId (taskId) });
            if(!task?.assignedTo.includes(user._id.toString())) throw new Error ("Not authorized to update this task");

            //Validacion status
            const newStatus = validateSatus(status.status);

            await db.collection<Tasks>(process.env.COLLECTION_NAME_T as string).updateOne(
                { _id: new ObjectId(taskId) },
                { $set: { status: newStatus } }
            );

            //Actualizacion en projects
            const project = await db
            .collection<Projects>(process.env.COLLECTION_NAME_P as string)
            .findOne({ _id: task.projectId });

            //Mostrarlo
            return await db
                .collection<Tasks>(process.env.COLLECTION_NAME_T as string)
                .findOne({ _id: new ObjectId (taskId) });
        },

        //Funciona
        deleteProject: async(_, {id}: {id: string}, ctx) => {
             const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            const db = getDB();
            //Comporbacion que el token recivido es el owner del proyecto
            const project = await db
                .collection<Projects>(process.env.COLLECTION_NAME_P as string)
                .findOne({ _id: new ObjectId(id) });
            if(!project) throw new Error("Project not found");
            if(project.owner !== user._id.toString()) throw new Error("Not authorized to delete this project");
        
            //Borrar Proyecto con ese id
            const projectDelete = await db
                .collection<Projects>(process.env.COLLECTION_NAME_P as string)
                .deleteOne({ _id: new ObjectId (id) });
            
            //Borrar todas las tareas en las que este el id del proyecto borrado
            const taskDelete = await db
                .collection<Tasks>(process.env.COLLECTION_NAME_T as string)
                .deleteMany({ projectId: new ObjectId (id) });
            
            return projectDelete.deletedCount > 0;
        }

    },
};