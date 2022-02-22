const debug = require('debug')('app:inicio');
const express = require ('express');
const morgan = require('morgan');
const config = require('config');
const Joi = require('joi')

const app = express();


//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


//configuracion de entornos

console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//uso de middleware de terceros

if(app.get('env')=== 'development'){
  app.use(morgan('tiny'))
//console.log('morgan habilitado')
debug('Morgan esta habilitado...')
}




const usuarios =[
    {id:1 , nombre:'Juan'},
    {id:2, nombre:'Maria'},
    {id:3, nombre:'Pedro'}
]

app.get('/',(req,res)=>{

    res.send('Hola Mundo desde Express')
});

app.get('/api/usuarios',(req,res)=>{
    res.send(usuarios)
});

app.get('/api/usuarios/:id',(req,res)=>{
    let usuario = usuarios.find( u => u.id === parseInt(req.params.id));
    if(!usuario) res.status(404).send('El usuario no fue encontrado') //si el usuario no existe
    res.send(usuario)// si si existe que muestre el usuario encontrado
});


app.post('/api/usuarios',(req,res)=>{

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
   const {error, value} = schema.validate({ nombre:req.body.nombre });
    if(!error){
        const usuario ={
       id: usuarios.length +1,  //aqui creo el usuario y le sumo 1 al id para que vaya de uno en uno
    nombre: value.nombre
    }
    usuarios.push(usuario); //guardo el usuario creado en el arreglo usuarios
    res.send(usuario);//muestro el usuario creado
    }else{

        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
    }


//if(!req.body.nombre || req.body.nombre.length <= 2){ //validacion
    //400 Bad request
  //  res.status(400).send('Tiene que ingresar un nombre que contenga minimo 3 letras')

 //   return;    //aqui hay que ponerlo para que corte el programa  y no me cree un usuario vacio
//}

 
});


app.put('/api/usuarios/:id', (req,res)=>{
    //primero buscar el objeto a modificar
    let usuario = usuarios.find( u => u.id === parseInt(req.params.id));
     if(!usuario){
     res.status(404).send('El usuario no fue encontrado') 
     return;
    }
        
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
   const {error, value} = schema.validate({ nombre:req.body.nombre });
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});


app.delete('/api/usuarios/:id',(req,res)=>{
    let usuario = usuarios.find( u => u.id === parseInt(req.params.id));
     if(!usuario){
     res.status(404).send('El usuario no fue encontrado') 
     return;
    }
    const index = usuarios.indexOf(usuario);//me retorna el indice del usuario encontrado
    usuarios.splice(index,1);// elimino un elemento 
    res.send(usuario);
});

const port = process.env.Port || 3000;

app.listen(port,()=>{
    console.log(`Escuchando desde el puerto ${port}.`)
}); 