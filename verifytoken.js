const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function(req,res,next){
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        await jwt.verify(token,process.env.TOKEN_SECRET,(error,authorizedUSer)=>{
            if (error) return res.status(400).send('Invalid');
            verified = authorizedUSer;
            req.user = verified;
            next();
        });
    }
    catch (error){
        res.status(400).send('Invalid Token');
    }
}