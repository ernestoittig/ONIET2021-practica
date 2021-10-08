const User = require('../models/user');
const Country = require('../models/country');
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
                            const lastAccess = user.lastAccess;
                            req.session.user = user;
                            req.session.isLoggedIn = true;
                            req.session.save( async (err) => {
                                if(err) res.status(400).json({message: 'error-session'});
                                else{
                                    user.lastAccess = new Date();
                                    await user.save();
                                    user = await user.populate('country', '-_id')/*.execPopulate()*/.then(user => user);
                                    user = user.toObject();
                                    delete user.password;
                                    user.lastAccess = lastAccess;
                                    return res.status(200).json({data:user});
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

exports.postGetUser = (req,res,next) => {
    if(!req.session.user) return res.status(200).json({data:null});
    User.findOne({_id: req.session.user._id})
        .then(async user => {
            if(user){
                user = await user.populate('country', '-_id')/*.execPopulate()*/.then(user => user);
                user = user.toObject();
                delete user.password;
                res.json({data: user});
            }
            else res.json({data: null});
        })
        .catch(err => console.log(err));
};

exports.postUpdateUser = async (req,res,next) => {
    const {email,name,surname,password,countryName} = req.body;
    
    if(name.length == 0 || surname.length == 0 || password.length == 0 || countryName.length == 0 ) 
        return res.status(422).json({error:'fields-not-valid'});

    User.find(email)
        .then(async user => {
            if(!user) return res.status(400).json({error:'user-not-found'});
            const hashedPassword = await bcrypt.genSalt(12).then(salt => bcrypt.hash(password,salt));
            const countryId = await Country.find({countryName}).select('_id').then(country => country);
            user.name = name;
            user.surname = surname;
            user.country = countryId;
            user.password = hashedPassword;
            await user.save();
            req.session.user = user;
            return res.status(200).json({data:user}); 
        })
        .catch(err => console.log(err));
}


exports.postGetCountries = async (req,res,next) => {
    Country.find()
        .then(countries => {
            if(countries) res.status(200).json(countries);
            else res.status(400).json({error:'error-countries'});
        })
        .catch(err => console.log(err));
}
