import Server from "./classes/server";
import userRoutes from "./routes/usuario";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from "body-parser";
import postRoutes from "./routes/post";
import fileUpload from "express-fileupload";
const server = new Server();

server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

server.app.use(fileUpload({useTempFiles:true}));

server.app.use(cors({origin:true,credentials:true}))

server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

/*
mongoose.connect('mongodb://localhost:27017/fotosgram',
                 {useNewUrlParser: true, useCreateIndex: true} as ConnectOptions ).then((res)=>{
                     console.log('Sea connectado a la base de datos'); 
                 }).catch((err) => {
                    console.log('No se pudo conectar '+ err); 
                 });

                
 mongoose.createConnection('mongodb://localhost:27017/fotosgram');*/

// or as an es module:
// 

/*// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'fotosgram';*/

async function main() {
/*  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('fotosgram');
  return;*/
  await mongoose.connect('mongodb://localhost:27017/fotosgram');
  return;
}

main().then((res)=>{
    console.log('Sea connectado a la base de datos'); 
}).catch((err) => {
   console.log('No se pudo conectar '+ err); 
});
  
server.start(()=>{
console.log(`Servidor corriendo en puerto ${server.port}`);
});