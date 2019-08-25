// Codificar el token con clave secreta, utilizando variable de entorno (process.env)

module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenprogramacioncompy"
};