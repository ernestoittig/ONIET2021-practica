const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/user');

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoCluster = process.env.MONGO_CLUSTER;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoURL = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}.r1lpn.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;

const app = express();

app.set('port',process.env.PORT || 5000);

app.use(express.static(path.join(__dirname,'..','..','frontend','dist')));

app.get('*',(req,res,next) =>{
    res.sendFile(path.join(__dirname,'..','..','frontend','dist','index.html'));
});

mongoose.connect(mongoURL,{useNewUrlParser:true, useUnifiedTopology:true})
    .then(async (res) => {
        const amountUsers = await User.countDocuments({name:'test1'}).then(amount => amount);
        console.log('amount of users: ', amountUsers);
        app.listen(app.get('port'));
    })
    .catch(err => console.log(err));
