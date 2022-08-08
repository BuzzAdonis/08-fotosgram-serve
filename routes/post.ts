import { Router, Response } from "express";
import FileSystem from "../classes/file-system";
import { FileUpload } from "../interfaces/file-upload";
import { verificaToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";

const postRoutes = Router();
const fileSystem = new FileSystem();
//Paginar Post
postRoutes.get('/',async (req:any,res:Response)=>{

    let pagina = Number(req.query.pagina) || 1;
    let skip =(pagina - 1) * 10;
    const posts = await Post.find()
                            .sort({_id:-1})
                            .skip(skip)
                            .limit(10)
                            .populate('usuario','-password')
                            .exec();
res.json({
    ok:true,
    pagina,
    posts
});

});

//Crear Post 

postRoutes.post('/',[verificaToken],(req:any , res:Response)=>{
    const body = req.body;
    body.usuario =req.usuario._id;

    const imagenes = fileSystem.ImagenesDesdeTempHaciaPost(req.usuario._id);
    body.img = imagenes;
    Post.create(body).then(async postDB=>{

        await postDB.populate('usuario','-password');
     res.json({
            ok:true,
            post:postDB
        });
    }).catch(err =>{
        res.json(err);  
    });

});

//Subir Archivos
postRoutes.post('/upload',[verificaToken],async(req:any,res:Response)=>{

            if(!req.files){
                res.status(400).json({
                    ok:false,
                    mensaje:'No se subio Ningun Archivo'
                });
            }
            const file:FileUpload = req.files.image;

            if(!file){
                res.status(400).json({
                    ok:false,
                    mensaje:'No se subio Ningun Archivo - image'
                }); 
            }
            if(!file.mimetype.includes('image')){
                res.status(400).json({
                    ok:false,
                    mensaje:'lo que subio no es una imagen'
                }); 
            }
          await  fileSystem.guardarImagenTemporal(file, req.usuario._id);
            res.json({
                ok:true,
                file:file.mimetype
            });

});

postRoutes.get('/imagen/:userid/:img',(req:any , res:Response)=>{
    const userid=req.params.userid;
    const img =req.params.img;
    const pashFoto =fileSystem.getFotosUrl(userid,img);
    res.sendFile(pashFoto);
});

export default postRoutes;