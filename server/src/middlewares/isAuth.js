exports.isAuth = (req,res,next) =>{
    if(req.session.isLoggedIn) next();
    else res.status(400).json({error:'server-desync'});
}

exports.isNotAuth = (req,res,next) =>{
    if(!req.session.isLoggedIn) next();
    else res.status(400).json({error:'server-desync'});
}
