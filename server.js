//----------------------------------------------------------------
// SERVIDOR

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const config = require('./config'); //

const User = require('./models/User');

const middleware = require('./middleware');
const service = require('./service');

// Conexión a la base de datos y las configuraciones
mongoose.connect('mongodb://localhost/token', { useNewUrlParser: true }, (err, res) => {
    // Si hay error, que lo muestre
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

app.set('superSecret', config.secret); // variable secreta

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Routes
app.get('/', (req, res) => {
    res.send('Hola! API: http://localhost:3000/api');
});

// Start server
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});

//----------------------------------------------------------------
// AGREGAR USUARIO
app.get('/setup', (req, res) => {
    // create a sample user
    let nick = new User({
        name: 'Sheyla',
        password: 'pro',
        admin: true
    });

    // save the sample user
    nick.save((err) => {
        if (err) throw err;

        console.log('Usuario guardado éxitosamente');
        res.json({ success: true });
    });
});

//----------------------------------------------------------------
// API ROUTES
const apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => {
    res.json({ message: 'Bienvenido al api de programacion.com.py :)' });
});

apiRoutes.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

app.use('/api', apiRoutes);

// Autenticar un nombre y una contraseña
apiRoutes.post('/authenticate', (req, res) => {
    // Buscar el usuario
    User.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Autenticación fallida. El usuario no fue encontrado.' });
        } else if (user) {

            // Valida si la contraseña coincide
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Autenticación fallida. Contraseña incorrecta' });
            } else {
                // Devolver la información, incluido el token como JSON
                res.json({
                    success: true,
                    message: 'Disfruta tu token!',
                    token: service.createToken(user)
                });
            }
        }
    });
});

//
apiRoutes.get('/private', middleware.ensureAuthenticated, (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    res.json({ message: 'Estás correctamente autenticado, tu ID es:' + req.user });
});

// Iniciamos las rutas de nuestro servidor
const router = express.Router();