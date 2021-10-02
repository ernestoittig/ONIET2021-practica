const path = require('path');

const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname,'..','..','frontend','dist')));
app.set('port',process.env.PORT || 3000);

app.get('*',(req,res,next) =>{
    res.sendFile(path.join(__dirname,'..','..','frontend','dist','index.html'));
});


app.listen(app.get('port'));