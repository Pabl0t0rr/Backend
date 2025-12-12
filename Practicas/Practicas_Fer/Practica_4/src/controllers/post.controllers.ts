import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { postCollection } from "../utils/utils";


export const createPost = async (title: string, content: string, author: string) => { 
    const db = getDB();
    const newPost = await db.collection(postCollection).insertOne({
        title,
        content,
        author,
        createdAt : new Date(),
    });

    const post = await db.collection(postCollection).findOne({_id : newPost.insertedId})
    return post;
};

export const updatePost = async (idPost: string, title : string, content: string) => {
    const db = getDB();
    const updatePost = await db.collection(postCollection).updateOne(
        {_id : new ObjectId(idPost)},
        {$set : {
            title,
            content,
            updatedAt: new Date()}
        })

    const result = await db.collection(postCollection).findOne({_id : new ObjectId(idPost)});    
    return result;
};

export const deletePost = async (idPost: string) => {
    const db = getDB();
    const errase = await db.collection(postCollection).deleteOne({_id : new ObjectId(idPost)})

    return errase ? true : false;
};

export const validatePostData = (title : string, content: string) => {
    const errors : string[] = [];
    if(title.trim() == "" || typeof title != "string") errors.push("The title has to be a string and not be blank");
    if(content.trim() == "" || typeof content != "string") errors.push("The content has to be a string and not be blank");
    return errors;    
};

export const duplicateTitle = async(title : string) => {
    const db = getDB();
    const exist = await db.collection(postCollection).findOne({title});
    return exist ? true : false;
};

export const titleValid = async (title: string, idPost: string) => {
    const db = getDB();
    const valid = await db.collection(postCollection).findOne({title, _id: { $ne: new ObjectId(idPost) }});
    return valid ? true : false;
};

export const idPostValid = async (idPost : string) => {
    const db = getDB();
    const valid = await db.collection(postCollection).findOne({_id : new ObjectId(idPost)})
    return valid ? true : false;
}

export const validAuthor = async(author : string, idPost : string) => {
    const db = getDB();
    const valid = await db.collection(postCollection).findOne(
        {_id : new ObjectId(idPost),
         author : new ObjectId(author)})

    return valid ? true : false;     
};

export const allPosts = async () => {
    const db = getDB();
    return await db.collection(postCollection).find().toArray();
};

export const postById = async (idPost : string) => {
    const db = getDB();
    const exist = await db.collection(postCollection).findOne({_id : new ObjectId(idPost)});
    return exist
}

