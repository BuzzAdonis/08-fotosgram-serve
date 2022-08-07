import { Schema, model, Document} from "mongoose";
import bcrypt from "bcrypt";
const usuarioShema = new Schema({

    nombre:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    avatar:{
        type:String,
        default:'av-1.png'
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es requerido']
    },
    password:{
        type:String,
        required:[true,'La cotraseña es requerida']
    }

});
interface IUsuario extends Document{
    nombre:string,
    email:string,
    password:string,
    avatar?:string,
    compararPassword(password:string):boolean;
}

usuarioShema.method('compararPassword', function(password:string = ''):boolean{
        return bcrypt.compareSync(password,this. password);
});

export const Usuario = model<IUsuario>('Usuario', usuarioShema);