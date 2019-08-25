// Accesso a rutas con autenticación

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');

exports.ensureAuthenticated = (req, res, next) => {
    // Comprobar si la petición lleva la cabecera de autorización
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({ message: "Error" }); // Si la petición no envía autorización, se envía error 403
    }

    // Obtener el token con el método split
    let token = req.headers.authorization.split(" ")[1];
    let payload = jwt.decode(token, config.TOKEN_SECRET); // decodifica el token y la clave

    if (payload.exp <= moment().unix()) {
        return res
            .status(401)
            .send({ message: "The token expires" });
    }

    // Identificar el usuario
    req.user = payload.sub;
    next();
}