var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Inicializacion de la base datos 
var admin = require("firebase-admin");
var serviceAccount = require("../elearning-a4a9a-firebase-adminsdk-6o10z-96b52163c0.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

//POST INICIAR SESION 
router.post('/login', function (req, res, next) {
  const datos = {
    correo: req.body.correo
  };

  if (datos['correo'] != "") {
    db.collection("Users").where("correo", "==", datos['correo']).get().then(querySnapshot => {
      if (querySnapshot.empty) {
        res.send("Usuario no existe")
      } else {
        querySnapshot.forEach(doc => {
          if (doc.exists) {
            res.json(doc.id);
          }
        })
      }
    })
  } else {
    res.send("Error")
  }

});


//POST PARA LA CREACION DE UN USUARIO 
router.post('/createUser', function (req, res, next) {

  // Formato JSON de envio de datos para crear un usuario
  const datos = {
    correo: req.body.correo,
    telefono: req.body.telefono
  };
  // Verificacion del correo si ya existe o no 

  db.collection("Users").where("correo", "==", datos['correo']).get().then(querySnapshot => {
    if (querySnapshot.empty) {
      if (datos['correo'] != "" && datos['telefono'] != "") {

        // creacion del usuario en la base de datos
        db.collection("Users").add({
          correo: datos['correo'],
          telefono: datos['telefono'],
          completado: 0
        }).then(() => {
          res.send('Usuario creado correctamente!');
        })

      }
    } else {
      querySnapshot.forEach(doc => {
        if (doc.exists) {
          res.send("Este usuario ya existe");
        }
      })
    }
  })



});


// POST PARA LA CREACION DE UNA SESION 
router.post('/addSesion', function (req, res, next) {

  // Formato JSON de envio de datos para crear una sesion
  const datos = {
    videoUrl: req.body.videoUrl,
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    fechacreacion: req.body.fechacreacion,
    fechalanzamiento: req.body.fechalanzamiento,
    imagenminiatura: req.body.imagenminiatura
  };

  if (datos['videoUrl'] != "" && datos['titulo'] != "" && datos['descripcion'] != "" &&
    datos['fechacreacion'] != "" && datos['fechalanzamiento'] != "") {
    db.collection("sesiones").add({
      titulo: datos['titulo'],
      video: datos['videoUrl'],
      descripcion: datos['descripcion'],
      fechacreacion: datos['fechacreacion'],
      fechalanzamiento: datos['fechalanzamiento'],
      imagenminiatura: datos['imagenminiatura']
    }).then(() => {
      res.send("Sesion creada!");
    }).catch(err => {
      res.send(err);
    })
  } else {
    res.send("Error al crear la sesion");
  }

});

// POST PARA LA CREACION DE COMENTARIOS
router.post('/create-comentario', function (req, res, next) {
  // Formato JSON de envio para el registro de un comentario
  const datos = {
    id_usuario: req.body.id_usuario,
    id_sesion: req.body.id_sesion,
    comentario: req.body.comentario
  };

  if (datos['id_usuario'] != "" && datos['id_sesion'] != "" && datos['comentario'] != "") {
    db.collection("comentarios").add({
      usuario: datos['id_usuario'],
      sesion: datos['id_sesion'],
      comentario: datos['comentario']
    }).then(() => {
      res.send("Comentario registrado!");
    }).catch(err => {
      res.send(err);
    })
  } else {
    res.send("Error al resgistrar comentario");
  }


});

// POST PARA LA CREACION DE NOTAS DEL USUARIO SOBRE UNA SESION 
router.post('/create-nota', function (req, res, next) {

  // Formato JSON de envio para el registro de una nota
  const datos = {
    id_usuario: req.body.id_usuario,
    id_sesion: req.body.id_sesion,
    nota: req.body.nota
  };

  if (datos['id_usuario'] != "" && datos['id_sesion'] != "" && datos['nota'] != "") {
    db.collection("notas").add({
      usuario: datos['id_usuario'],
      sesion: datos['id_sesion'],
      nota: datos['nota']
    }).then(() => {
      res.send("nota registrada!");
    }).catch(err => {
      res.send(err);
    })
  } else {
    res.send("Error al resgistrar nota");
  }
});


// POST  PARA SESION COMPLETADA 
router.post('/completado', function (req, res, next) {
  // Formato JSON de sesion completada
  const datos = {
    id_sesion: req.body.id_sesion,
    id_usuario: req.body.id_usuario
  };

  db.collection("completados").where("sesion_completada", "==", datos['id_sesion']).where("usuario", "==", datos['id_usuario']).get().then(querySnapshot => {
    if (querySnapshot.empty) {
      if (datos['id_sesion'] != "" && datos['id_usuario'] != "") {
        // Registra la sesesion completada
        db.collection("completados").add({
          usuario: datos['id_usuario'],
          sesion_completada: datos['id_sesion']
        })

        // Agrega el progreso al usuario 
        
        var datosUser = db.collection("Users").doc(datos['id_usuario']).get().then(doc =>{
          db.collection("Users").doc(datos['id_usuario']).update({
            completado: parseInt(doc.data().completado) + 12.5
          }).then(() => {
            res.send("Completado!")
          })  
        });
        
      }
    } else {
        res.send("Esta sesion ya esta completada!")
    }
  })


});


// GET PARA VER TODOS LOS USUARIOS 
router.get('/users', function (req, res, next) {
  let datosUser = [];
  var i = 0;
  db.collection("Users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      datosUser[i] =
      {
        id : doc.id,
        correo: doc.data().correo,
        telefono: doc.data().telefono,
        completado : doc.data().completado

      }
      i++;

    })

    res.json(datosUser);
  }).catch(Error => { console.log("Error al Listar") });
});

// GET PARA VER TODOS LAS SESIONES 
router.get('/sesiones', function (req, res, next) {
  let datosSesion = [];
  var i = 0;
  db.collection("sesiones").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      datosSesion[i] =
      {
        id: doc.id,
        video: doc.data().video,
        titulo: doc.data().titulo,
        descripcion: doc.data().descripcion,
        fechacreacion: doc.data().fechacreacion,
        fechalanzamiento: doc.data().fechalanzamiento,
        imagenminiatura: doc.data().imagenminiatura
      }
      i++;

    })

    res.json(datosSesion);
  }).catch(Error => { console.log("Error al Listar") });
});

//GET CON LOS DATOS DEL ID DEL USUARIO
router.get('/Users/:id', function (req, res, next) {
  var busqueda = req.params.id;
  db.collection("Users").doc(busqueda).get().then(doc => {
    if (doc.exists) {
      var datos ={
        id : doc.id,
        correo: doc.data().correo,
        telefono: doc.data().telefono,
        completado : doc.data().completado

      }
      res.json(datos);
    } else {
      res.send("ID DE USUARIO NO EXISTE")
    }
  })

});

//GET CON LOS DATOS DE UNA SESION CON SU ID 
router.get('/sesiones/:id', function (req, res, next) {
  var busqueda = req.params.id;
  db.collection("sesiones").doc(busqueda).get().then(doc => {
    if (doc.exists) {
      var datos =  {
        id: doc.id,
        video: doc.data().video,
        titulo: doc.data().titulo,
        descripcion: doc.data().descripcion,
        fechacreacion: doc.data().fechacreacion,
        fechalanzamiento: doc.data().fechalanzamiento,
        imagenminiatura: doc.data().imagenminiatura
      }
      res.json(datos);
    } else {
      res.send("ID DE LA SESION NO EXISTE")
    }
  })

});

//GET CON LOS COMENTARIOS POR SESION 
router.get('/comentarios/:id', function (req, res, next) {
  let datosSesion = [];
  var i = 0;
  var busqueda = req.params.id;
  db.collection("comentarios").where("sesion", "==", busqueda).get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      datosSesion[i] = {
        id_comentario : doc.id,
        usuario: doc.data().usuario,
        sesion: doc.data().sesion,
        comentario: doc.data().comentario
      }
      i++;
    })
    res.json(datosSesion);
  }).catch(err => { res.send(err) })
});

//GET CON LAS NOTAS POR SESION Y USUARIO
router.get('/notas/:idSesion/:idUsuario', function (req, res, next) {
  let datosSesion = [];
  var i = 0;
  var idSesion = req.params.idSesion;
  var idUsuario = req.params.idUsuario;

  db.collection("notas").where("sesion", "==", idSesion).where("usuario", "==", idUsuario).get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      datosSesion[i] = {
        id_nota : doc.id,
        usuario: doc.data().usuario,
        sesion: doc.data().sesion,
        nota: doc.data().nota
      }
      i++;
    })
    res.json(datosSesion);
  }).catch(err => { res.send(err) })
});

//GET VERIFICANDO SI UN USUARIO YA COMPLETO UNA SESION 
router.get('/completados/:idUsuario/:idSesion', function (req, res, next) {

  var idUsuario = req.params.idUsuario;
  var idSesion = req.params.idSesion;

  db.collection("completados").where("sesion_completada", "==", idSesion).where("usuario", "==", idUsuario).get().then((querySnapshot) => {
    if (!querySnapshot.empty) {
      res.send("Sesion completa")
    } else {
      res.send("Sesion incompleta")
    }
  });

});


module.exports = router;
