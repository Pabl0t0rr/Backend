import { Router } from "express";
import { authRequest,verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.get("/user",verifyToken, (req : authRequest, res) => { //Solo se pone el async si se hacen promesas dentro
    res.json({
        message : "Acceso permitido",
        user : req.user,
    });
});

export default router;