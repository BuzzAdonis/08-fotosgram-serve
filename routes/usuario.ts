import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";
const  userRoutes = Router();
userRoutes.post('/login', (req:Request, res:Response)=>{
const body = req.body;
    Usuario.findOne({ email: body.email }, (err:any,userDB:any) => {

    if(err) throw err;
    
    if(!userDB) {
        res.json({
            ok: false,
            mensaje:"Usuario/Contraseña no son corretos"});
        }

    if(userDB.compararPassword(body.password)){
        const tokenUser = Token.getJwtToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });
        res.json({
            ok: true,
            token:tokenUser});
        }
        else{
            res.json({
                ok: false,
                mensaje:"Usuario/Contraseña no son corretos"});
            }    
        });

});



userRoutes.post('/create', async (req:Request, res:Response) => {

    const user ={
        nombre:req.body.nombre,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,10),
        avatar:req.body.avatar
    };

  await  Usuario.create(user).then(userDB=>{
    const tokenUser = Token.getJwtToken({
        _id:userDB._id,
        nombre:userDB.nombre,
        email:userDB.email,
        avatar:userDB.avatar
    });
    res.json({
        ok: true,
        token:tokenUser});
        
    }).catch(err=>{
        res.json({
            ok:false,
            err
            });
    });
});

userRoutes.post('/update', verificaToken, async (req:any, res:Response) => {

    const user ={
        nombre:req.body.nombre || req.usuario.nombre,
        email:req.body.email || req.usuario.email,
        avatar:req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user,{new:true},(err,userDB)=>{
        if(err) throw err;
        if(!userDB){
            return res.json({
                ok:false,
                mensaje:'No exite un usuario con ese ID'
            });
        }
        const tokenUser = Token.getJwtToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });
        res.json({
            ok: true,
            token:tokenUser});
    });
});

export default userRoutes;