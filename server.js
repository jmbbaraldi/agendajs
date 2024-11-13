require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Database connected.')
        app.emit('ready');
    })
    .catch(e => console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { checkCsrfError, csrfMiddleware, middlewareGlobal } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'asdasd',
    store: new MongoStore({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.use(middlewareGlobal);

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('ready', () => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    })
})