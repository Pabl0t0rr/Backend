//Imports basics
import { IResolvers } from "@graphql-tools/utils";

//Import controllers
import { createUser, validateUser, validateUserData, duplicateName } from "../controllers/users.controllers";
import { signToken } from "../controllers/auth.controllers";
import { createPost, validatePostData, duplicateTitle, updatePost, titleValid, validAuthor, deletePost, idPostValid, allPosts, postById} from "../controllers/post.controllers";

export const resolvers: IResolvers = {
    Query: {
       userInfo: async(_, __, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            return {
                _id : user._id,
                ...user
            }
       },

       allPost: async(_, __, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");

            return await allPosts();
       },

       postById: async (_, {idPost} : {idPost : string}, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");
            
            //Comprobar que el idPost existe
            const validId = await idPostValid(idPost);
            if(!validId)throw new Error ("idPost does not exist");

            //Devolver el post que coincida con el id
            return postById(idPost);
       }
    },

    Mutation: { //Finalizadas las mutaciones con todas las funciones para poder realizar las comprobaciones
        register: async(_, {email, password, username} : {email: string, password: string, username: string}) => {
            //Comprobar que lo que se inserta son valores validos
            const validate = validateUserData(email, username, password)
            if(validate.length > 0) throw new Error(validate.join(" | ")) //Comporbacion basica de los parametros

            //Comprobar si ya existe un usuario con ese nombre
            const existName =  await duplicateName(username)
            if(existName)throw new Error("This name is alredy use");

            const user = await createUser(email, username, password);

            return {
                token: signToken(user._id.toString()),
                userInfo : user
            }
        },   
        
        login: async(_, {email, password, username} : {email: string, password: string, username: string}) => {
             const exist = await validateUser(email, password , username);
             if(!exist) throw new Error ("Invalid acces info");

             return signToken(exist._id.toString())
        },

        createPost: async (_,{title, content}: {title : string, content : string}, ctx) => {
            const user = ctx.user
            if(!user) throw new Error("Not authenticated");
            
            //Validar los datos de entrada
            const validate =  validatePostData(title, content);
            if(validate.length> 0) throw new Error( validate.join(" | "));

            //Comprobar qeu el nombre que s ele pone no exista
            const duplicate = await duplicateTitle(title);
            if(duplicate) throw new Error("There is already a post with that title");
            
            const post =  await createPost(title, content, user._id);

            return post;
        },

        updatePost: async(_,{idPost,title, content}: {idPost : string,title : string, content : string}, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");

            //Comprobar si es el author
            const author =  await validAuthor(user._id.toString(), idPost);
            if(!author) throw new Error("You are not the author to modified");
            
            //Comprobar que el idPost existe
            const validId = await idPostValid(idPost);
            if(!validId)throw new Error ("idPost does not exist");

            //validar que los campos sean correctos
            const validate =  validatePostData(title, content);
            if(validate.length> 0) throw new Error( validate.join(" | "));

            //Comprobar que el titulo que se ponga no esta usado
            const duplicate = await titleValid(title, idPost);
            if(duplicate) throw new Error("There is already a post with that title");
            
            const post = await updatePost(idPost,title, content);

            return post;
        },

        deletePost: async(_,{idPost} : {idPost : string}, ctx) => {
            const user = ctx.user;
            if(!user) throw new Error("Not authenticated");

            //Comprobar que el idPost existe
            const validId = await idPostValid(idPost);
            if(!validId)throw new Error ("idPost does not exist");
            
            const result = await deletePost(idPost);

            return result;
        }
    },
};