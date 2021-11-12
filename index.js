//Paquetes
const express=require("express");
const app=express();
const body=require("body-parser");
const mysql=require("mysql");
const objeto=require("./personas.json");
const Console = require("console");

//Creamos la configuracion
const port = process.env.PORT || 3525;
const conexion=mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "5212ivan",
        database: "Escuela"
    }
)

//Midlewares
app.use(body.urlencoded({extends:false}));
app.use(body.json());

//Configuracion de los cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Escucha el servicio
app.listen(port,()=>{
    console.log("Servicio corriendo");
    //Realizamos la conexion a la base de datos
    conexion.connect((error) => {
        if (error) {
            console.log(error);
        }else{
            console.log("Conectado a Escuela");
        }
    });
});

//Materia
app.get("/Allmaterias",(d,r)=>{
    //REalizamos la consulta a la tabla autos
    conexion.query("select * from Materia",(error,filas)=>{
        r.status(200).send(filas);
    })
})
app.post("/Addmateria",(d,r)=>{
    const datos=d.body;
    conexion.query(`insert into Materia(Nombre) values('${datos.nombre}')`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.delete("/Deletemateria/:id",(d,r)=>{
    const id=d.params.id;
    conexion.query(`DELETE FROM Materia WHERE idMateria = ${parseInt(id)}`,(error,filas)=>{
        if(error) r.send(error);
        r.send(filas);
    })
});
app.put("/Updatemateria/:id",(d,r)=>{
    const body=d.body;
    const p=d.params;
    console.log(body.nombre);
    console.log(p.id);
    conexion.query(`update Materia set Nombre = '${body.nombre}' where idMateria = ${parseInt(p.id)}`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})


//Grupos
app.get("/Allgrupos",(d,r)=>{
    conexion.query("select * from Grupo",(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.post("/Addgrupo",(d,r)=>{
    const datos=d.body;
    conexion.query(`insert into Grupo(Grado,Grupo) values('${datos.grado}','${datos.grupo}')`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.put("/Updategrupo/:id",(d,r)=>{
    const body=d.body;
    const p=d.params;
    console.log(body.grado);
    console.log(body.grupo);
    conexion.query(`update Grupo set Grado = ${body.grado}, Grupo='${body.grupo}' where idGrupo = ${parseInt(p.id)}`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.delete("/Deletegrupo/:id",(d,r)=>{
    const id=d.params.id;
    conexion.query(`DELETE FROM Grupo WHERE idGrupo = ${parseInt(id)}`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})


//Todo Alumnos
app.get("/ObtenerAlumno/:id",(d,r)=>{
    const id=d.params.id;
    conexion.query(`select * from Alumno where idAlumno=${id}`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.get("/Allalumnos",(d,r)=>{
    conexion.query("select * from Alumno",(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.post("/Addalumno",(d,r)=>{
    const datos=d.body;
    conexion.query(`insert into Alumno(Nombre,Apellidos,Genero,Telefono,Direccion,idGrupo) 
                    values('${datos.nombre}','${datos.apellidos}','${datos.genero}','${datos.telefono}','${datos.direccion}',${datos.idGrupo})`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.put("/Updatealumno/:id",(d,r)=>{
    const body=d.body;
    const p=d.params;
    console.log(body);
    conexion.query(`update Alumno set Nombre = '${body.nombre}', Apellidos = '${body.apellidos}', Genero = '${body.genero}', Telefono = '${body.telefono}', Direccion = '${body.direccion}', idGrupo = ${body.idGrupo} where idAlumno = ${parseInt(p.id)}`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})
app.delete("/Deletealumno/:id",(d,r)=>{
    const id=d.params.id;
    conexion.query(`DELETE FROM Alumno WHERE idAlumno = ${parseInt(id)}`,(error,filas)=>{
        if(error) r.send(error);
        r.status(200).send(filas);
    })
})

//Todo Carga de las materias
app.post("/Cargamaterias",(d,r)=>{
    const datos=d.body;
    let contador=0;
    for(let materia of datos.materia){
        conexion.query(`insert into CargaMateria(idGrupo,idMateria) values(${datos.grupo},${materia})`,(error,filas)=>{
            if(contador===0){
                r.send(filas);
            }
            contador+=1;
        })
    }
})

//Todo ultima vista
app.get("/Lista/:id",(d,r)=>{
    const grupo=d.params.id;
    conexion.query(`select a.idAlumno as 'id', a.Nombre as 'Nombre', a.Apellidos as 'Apellidos',  a.Telefono as 'Telefono', a.Direccion as 'Direccion' from Alumno a join Grupo g on a.idGrupo=g.idGrupo where g.idGrupo=${grupo}`,(error,filas)=>{
        if(error) r.send(error);
        r.send(filas);
    })
})
app.get("/ListaMateria/:id",(d,r)=>{
    const id=d.params.id;
    conexion.query(`select m.idMateria as 'id', m.Nombre as 'Nombre' from CargaMateria c join Materia m on c.idMateria=m.idMateria where c.idGrupo=${id}`,(error,filas)=>{
        if(error) r.send(error);
        r.send(filas);
    });
})
