const jwt = require('jsonwebtoken');
const authConfig = require("../configuration/auth.json");
module.exports = {
    checkToken (req, res, next) {
        //get authcookie from request
        const authcookie = req.cookies.authcookie;
        //verify token which is in cookie value
        jwt.verify(authcookie,authConfig.secret,(err,data)=>{
            if(err){
                res.redirect('/auth/authenticate');
            } 
            else if(data){
                req.user = data.user;
                next();
            }
        });
    }
}