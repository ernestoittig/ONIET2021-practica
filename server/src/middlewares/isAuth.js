exports.isAuth = (req,res,next) =>{
    if(req.session.isLoggedIn) next();
    else res.status(400).send(null);
}

exports.isNotAuth = (req,res,next) =>{
    if(!req.session.isLoggedIn) next();
    else res.status(400).send(null);
}
