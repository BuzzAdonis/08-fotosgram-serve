import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
export default class FileSystem{
    constructor(){};
   guardarImagenTemporal(file:FileUpload,userID:string){

    return new Promise((resolve,reject) =>{
    //crear carpeta
        const path = this.crearCarpetaUsuario(userID);
    //nombre del archivo
        const nombreArchivo = this.generarNombreUnico(file.name);
    //Mover archivo del Temp a nuestra carpeta
        file.mv(`${path}/${nombreArchivo}`,(err:any)=>{
                if(err){
                    reject(err);
                }else{
                    resolve;
                }
        });
    });

    }
    
    private generarNombreUnico(nombreOriginal:string){
        const nombreArr=nombreOriginal.split('.');
        const extencion=nombreArr[nombreArr.length - 1];
        const idUnico = uniqid();
        return `${idUnico}.${extencion}`;
    }
    private crearCarpetaUsuario(userID:string){
        const pathUser = path.resolve(__dirname,'../uploads/',userID);
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync(pathUser);
        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    ImagenesDesdeTempHaciaPost(userID:string){
        const pathTemp = path.resolve(__dirname,'../uploads/',userID,'temp');
        const pathPost = path.resolve(__dirname,'../uploads/',userID,'posts');

        if(!fs.existsSync(pathTemp)){
            return [];
        }
        if(!fs.existsSync(pathPost)){
            fs.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userID);
        imagenesTemp.forEach(imagen=>{
            fs.renameSync(`${pathTemp}/${imagen}`,`${pathPost}/${imagen}`)
        });
        return imagenesTemp;
    }
    private obtenerImagenesEnTemp(userID:string){
        const pathTemp = path.resolve(__dirname,'../uploads/',userID,'temp');
        return fs.readdirSync(pathTemp) || [];
    }
    getFotosUrl(userID:string, img:string){

        const pathPost = path.resolve(__dirname,'../uploads/',userID,'posts',img);
        if(!fs.existsSync(pathPost)){
            return path.resolve(__dirname,'../assets/400x250.jpg');
        }
        return pathPost;
    }
}