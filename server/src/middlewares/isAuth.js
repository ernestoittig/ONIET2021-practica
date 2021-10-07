exports.isAuth = (req,res,next) =>{
    if(req.session.isLoggedIn) next();
    else res.status(200).json(null);
}

exports.isNotAuth = (req,res,next) =>{
    if(!req.session.isLoggedIn) next();
    else res.status(200).json(null);
}
