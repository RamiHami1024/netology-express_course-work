const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const api = require('./router/index');
const socketIO = require('socket.io');
const {socketHandler} = require('./handlers/socket');
const passport = require('./middlewares/passport');
const session = require('express-session');
const cookie = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const HOST = process.env.HTTP_HOST;
const PORT = Number(process.env.HTTP_PORT);
const MONGO_URL = process.env.MONGO_URL;

io.on('connection', (socket) => {
    socketHandler(socket);
});

app.use(express.urlencoded({extended: false}));
app.use(cookie());
app.use(session({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/api', api);

async function init() {
    try {
        await mongoose.connect(MONGO_URL);

        if (!mongoose.connection.readyState) {
            console.log('\nConnection broken. Check errors.');
        }

        console.log('\nMongoose is connected to db with status-code:', mongoose.connection.readyState, '\n');
        server.listen(PORT, HOST);
    } catch (error) {
        console.log('\nError: \n', error);
    }
}

init();