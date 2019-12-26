const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        jwt.verify(token,process.env.TOKEN_SECRET,(error,authorizedUSer)=>{
            if (error) return res.status(400).send('Invalid Token');
            verified = authorizedUSer;
            req.user = verified;
            next();
        });
    }
    catch (error){
        res.status(400).send('Invalid Token');
    }
}