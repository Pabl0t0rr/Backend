import { Router } from "express";
import { getDb } from "../mongo";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//Imports middleware
import { registerUser, loginUser } from "../middlewares/validateUser";

dotenv.config();

const router = Router();

const SECRET = process.env.SECRET;

type User = {
  _id? : ObjectId;
  username : string;
  email : string;
  password : string;
};

type JwtPayload = {
  id : string;
  email : string;
};
const collectionName  = process.env.COLLECTION_NAME_U;
const coleccion = () => getDb().collection<User>(collectionName as string);


// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
      const page = Number(req.query?.page) || 1;
      const limit = Number(req.query?.limit) || 2; //Limite de 2 Productos por pagina
      const skip = (page -1) * limit;
      const users = await coleccion().find().skip(skip).limit(limit).toArray(); //Un cursor es un puntero de C pero en mongodb
  
      // Construir la URL base
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  
      // URLs de siguiente y previa página
      const nextPageUrl = users.length === limit ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
      const previousPageUrl = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;
  
      res.status(200).json({
        info :{
          page : page,
          numberOfUsersPerPage : limit,
          nextPage : users.length === limit ? nextPageUrl : null,
          previousPage : page > 1 ? previousPageUrl : null
        },
        users
      });
    } catch (err) {
      res.status(404).json(err);
  }
});

router.post("/register",registerUser, async (req, res) => {

  try {
    const {username, email, password} = req.body as {username: string, email : string, password : string};
    const users = coleccion();
    const existEmail = await users.findOne({email : email});
    const existUser = await users.findOne({username : username});

    if(existUser){
      return res.status(409).json({message : "Usuario ya existente"});
    }

    if(existEmail){
      return res.status(409).json({message : "Email ya existente"});
    }

    const passwordEnc = await bcrypt.hash(password,10); // Para encriptar
    await users.insertOne({username : username,email : email, password : passwordEnc});

    //Poner mensaje correcto
    res.status(201).json({message : "Usuario creado correctamente"});

  } catch (err) {
    res.status(500).json({message : err}); //Error 500 es error de registro
  }
});

router.post("/login",loginUser, async(req, res) => {
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