# E-learning

DESPLIEGUE :  https://api-elearning.herokuapp.com/

METODO POST /login  =>  Este metodo recibe un JSON para verificar la exitencia de un usuario en el sistema y darle acceso
<br></br>
{
    "correo": "Coreo nuevo usuario"
}

Si el usuario existe retornara = id_usuario
_______________________________________________________________________________________________________

METODO POST /createUser  =>  Recibe un JSON con el cual registra a los usuarios en la base de datos  
<br></br>
{
    "nombre": " ",
    "correo": "Correo del usuario",
    "telefono": "numero de telefono del usuario"
}

Si el usuario se creo retornara = Usuario creado correctamente!

_______________________________________________________________________________________________________

METODO POST /addSesion  => Recibe un JSON con todos los datos necesarios para crear una nueva sesion
<br></br>
{
    "videoUrl": "",
    "titulo": "",
    "descripcion": "",
    "fechacreacion": "",
    "fechalanzamiento": "",
    "imagenminiatura": ""
}

Si la sesion se creo retornara = Sesion creada!

___________________________________________________________________________________________________________________

METODO POST /create-comentario => Recibe un JSON con los datos del usuario y la sesion para registrar un comentario
<br></br>
{
    "id_usuario": "",
    "id_sesion": "",
    "comentario": ""
}

Si encuentra la sesion y el usuario, les asignara el comentario y retornara = Comentario registrado!

_____________________________________________________________________________________________________________________________

METODO POST /create-nota => Recibe un JSON con los datos del usuario y sesion para crear la nota del usuario en dicha sesion
<br></br>
{
    "id_usuario": "",
    "id_sesion": "",
    "nota": ""
}

Si encuentra la sesion y el usuaria, Creara la nota para ese usuario en la sesion y retornara = nota registrada!

___________________________________________________________________________________________________________________________________

METODO POST /completado => Recibe un JSON con los datos del usuario y la sesion para registrar que el usuario ya completo la sesion
<br></br>
{
    "id_sesion": "",
    "id_usuario": ""
}

Si encuentra el usuario sesion, se la registrara como completada y devolvera = Completado!

_____________________________________________________________________________________________________________________________________

METODO GET /Users  => Retorna un JSON con todos los datos de usuarios registrados

_____________________________________________________________________________________________________________________________________

METODO GET /sesiones  => Retorna un JSON con todos los datos de las sesiones creadas

_____________________________________________________________________________________________________________________________________

METODO GET /Users/id  => Este metodo busca mediante el ID del usuario todos sus datos y los retorna en un JSON

_____________________________________________________________________________________________________________________________________

METODO GET /sesiones/id  => Este metodo busca mediante el ID de una sesion todos sus datos y los retorna en un JSON

_____________________________________________________________________________________________________________________________________

METODO GET /comentarios/id => Este metodo busca mediante el ID de una sesion todos los comentarios asociados a ella y los retorna en un JSON

_____________________________________________________________________________________________________________________________________

METODO GET /notas/idSesion/idUsuario => Este metodo busca mediante el ID del usuario y sesion todas las notas asignadas por el usuario a una sesion 

_____________________________________________________________________________________________________________________________________

METODOS GET /completados/idUsuario/idSesion  => Este metodo verifica si un usuario ya completo una sesion, si esta terminada retorna = Sesion completa



