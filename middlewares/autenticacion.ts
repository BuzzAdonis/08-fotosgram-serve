import { NextFunction,  Response } from "express";
import Token from "../classes/token";


export const verificaToken = (req:any, res:Response, next:NextFunction)=>{

    const userToken =req.get('x-token') || '';

    Token.comprobarToken(userToken).then((decoder:any)=>{
        req.usuario =decoder.usuario;
        next();
    }).catch(err =>{
        res.json({
            ok:false,
            mensaje:'Token no es correcto'
        });
    });
}