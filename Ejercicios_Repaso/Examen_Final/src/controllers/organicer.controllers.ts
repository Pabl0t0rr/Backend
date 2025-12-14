import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { organicerCollection } from "../utils/utils";
import { OrganicerRole } from "../types/enums";

export const allOrganicers = async(page : number, limit : number) => {
    const db = getDB();
    const organicers = await db.collection(organicerCollection).find().skip((page - 1) * limit).limit(limit).toArray();
    return {
        info : {
            page,
            limit
        },
        results: organicers
    };
};

export const organicerById = async (id: string) => {
    const db = getDB();
    const organicer = await db.collection(organicerCollection).findOne({ _id: new ObjectId(id) });
    return organicer;
};

export const createOrganicer = async(name : string, email: string, password: string, role: OrganicerRole) => {
    const db = getDB();
    const passEncript = await bcrypt.hash(password, 10);

    const newOrganicer = await db.collection(organicerCollection).insertOne(
        {
            name,
            email: email,
            password: passEncript,
            role,
            createdAt : new Date().toISOString() //para tener un string cno formato date
        });
    const result = await db.collection(organicerCollection).findOne({_id: newOrganicer.insertedId});
    if(!result) return null;
    return result;
};

export const validateOrganicer = async (email : string, password :string) => {
    const db = getDB();
    const organicer = await db.collection(organicerCollection).findOne({email : email, })
    if(!organicer) return null;

    const validPass = await bcrypt.compare(password, organicer.password);
    if(!validPass) return null;

    return organicer;
}

export const duplicateEmailO = async (email : string) => {
    const db = getDB();
    const valid = await db.collection(organicerCollection).findOne({email: email});
    return valid ? false : true;
}

export const validateOrganicerRole = async (id : string) => {
    const db = getDB();
    const valid = await db.collection(organicerCollection).findOne(
        {_id : new ObjectId(id),
         role :   {$eq : OrganicerRole.ORGANICER}});
         
    return valid ? true : false;
}
