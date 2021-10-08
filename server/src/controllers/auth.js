const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postLogIn = async (req,res,next) => {
    const {email,password} = req.body;
    User.findOne({email})
        .then(user => {
            if(user){
                bcrypt.compare(password,user.password)
                    .then(async doMatch => {
                        if(!doMatch) return res.json({error:'user-not-found'});
                        else{
                            req.session.user = user;
                            req.session.isLoggedIn = true;
                            req.session.save( async (err) => {
                                if(err) res.status(400).json({message: 'error-session'});
                                else{
                                    await User.findOne({email})
                                            .then(async user => {
                                                user = await user.populate('country', '-_id')/*.execPopulate()*/.then(user => user);
                                                user = user.toObject();
                                                console.log(user);
                                                delete user.password;
                                                if(user) res.status(200).json({data:user});
                                                else res.json({message: 'user-not-found'});
                                            })
                                } 
                            });   
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
    if(!req.session.user) return res.status(200).json({data:null});
    User.findOne({_id: req.session.user._id})
        .then(async user => {
            if(user){
                user = await user.populate('country', '-_id')/*.execPopulate()*/.then(user => user);
                user = user.toObject();
                console.log(user);
                delete user.password;
                res.json({data: user});
            }
            else res.json({data: null});
        })
        .catch(err => console.log(err));
};