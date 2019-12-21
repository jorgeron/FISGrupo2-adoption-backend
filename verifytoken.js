const jwt = require('jsonwebtoken');
const TOKEN_SECRET = (process.env.TOKEN_SECRET || 'kjdjvfvjdfsjvfvn4546546nk5jyn6k5u75ku7b564j7b');

module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        jwt.verify(token,TOKEN_SECRET,(err,authorizedUser)=>{
            if(!err) req.user = authorizedUser;
        });
        next();
    }
    catch (error){
        res.status(400).send('Invalid Token');
    }
}