import { Router } from "express";
import { getDb } from "../db/mongo";
import { User, JwtPayload } from "../types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//Imports middlewares
import { registerUser , loginUser } from "../middlewares/users/validateUser";

dotenv.config();

const router = Router();

const SECRET = process.env.SECRET;

const collectionName  = process.env.COLLECTION_NAME_U;
const coleccion = () => getDb().collection<User>(collectionName as string);


// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const resultados = await coleccion().find().toArray();
    res.status(200).json(resultados);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.post("/reg", registerUser, async (req, res) => {

  try {
    const {email, username, password} = req.body as {email : string, username: string, password : string};
    const users = coleccion();
    const exist = await users.findOne({email : email});
    
    if(exist){
      return res.status(400).json({message : "Email ya existente"});
    };

    const passwordEnc = await bcrypt.hash(password,10); // Para encriptar
    await users.insertOne({email : email, username : username, password : passwordEnc});

    //Poner mensaje correcto
    res.status(201).json({message : "Usuario creado correctamente"});

  } catch (err) {
    res.status(500).json({message : err}); //Error 500 es error de registro
  }
});

router.post("/login", loginUser, async(req, res) => {
  try {
    const {email, password} = req.body as {email : string, password : string};
    const users = coleccion();

    const user = await users.findOne({email : email});
    if(!user) return res.status(404).json({message : "email incorrecto"});

    const validPass = await bcrypt.compare(password, user.password);
    if(!validPass) return res.status(404).json({message : "constraseña incorrecta"});

    const token = await jwt.sign({id : user._id?.toString(), email: user.email} as JwtPayload, SECRET as string, {expiresIn : "1h"});

    res.status(201).json({message : "Login correcto", token});

  } catch (err) {
    res.status(500).json({messsage : err});
  }
});

export default router;