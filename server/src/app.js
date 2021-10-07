const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const csrf = require('csurf');
require('dotenv').config();

const apiRouter = require('./routes/api');
const User = require('./models/user');
const Country = require('./models/country');

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoCluster = process.env.MONGO_CLUSTER;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoURL = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}.r1lpn.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;

const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan('short'));
app.use(
    session({
        secret: process.env.SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoURL,
            collectionName: 'sessions',
            touchAfter: 60, //Seconds
            // ttl: 60,                                                      //Seconds
            autoRemove: 'interval',
            autoRemoveInterval: 70, //Minutes to delete the expired session
        }),
        cookie: { maxAge: 60 * 60 * 1000, httpOnly: true },
    })
);

app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));

app.use( async (req,res,next) => {                                           //*Use Mongoose Methods and update Session req (passport) 
    if(req.session.user){
        User.findById(req.session.user._id)
            .then(user => {
                if(user) req.user = user;                                   
                next();
            })
            .catch(err => next(err));
    }
    else next();
});

app.use('/', (req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});
    
app.use('/api', apiRouter);


app.get('*', (req, res, next) => {
    res.sendFile(
        path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html')
    );
});

app.use((err,req,res,next) => {
    console.log(err);
    next();
})

mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async res => app.listen(app.get('port')))
    .catch(err => console.log(err));
