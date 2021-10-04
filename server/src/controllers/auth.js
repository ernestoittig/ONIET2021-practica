const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postLogIn = async (req,res,next) => {
    const {email,password} = req.body;
    User.findOne({email})
        then(user => {
            if(user){
                bcrypt.compare(password,user.password)
                    .then(doMatch => {
                        if(!doMatch) return res.json({error:'user-not-found'});
                        else{
                            req.session.user = user;
                            req.session.isLoggedIn = true;
                            req.session.save( (err) =>  err ? res.json({message: 'user-not-auth'}) : res.json({message: 'user-auth'}) );   
                        }
                    })
                    .catch(err => console.log(err));
            }
            else return res.json({error:'user-not-found'});
        })
        .catch(err => console.log(err));
};

exports.postLogOut = (req,res,next) => {
    if(req.session.user._id.toString() == req.user._id.toString()){
        req.session.destroy((err) => {
            console.log('err(session): ', err);
            res.json({message: 'user-logged-out'});
        });
    }
};

exports.getUser = (req,res,next) => {
    User.findOne({_id: req.session.user._id})
        .then(user => {
            if(user) res.json(user);
            else res.json({error: 'user-not-found'});
        })
        .catch(err => console.log(err));
};