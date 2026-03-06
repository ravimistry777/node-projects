const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

exports.verifyToken = async (req, res, next) => {
    let authorization = req.headers.authorization;
    if(!authorization){
        return res.json({message: 'Unauthorized'})
    }

    let token = authorization.split(" ")[1];
    let decode = jwt.verify(token, "ravi.dev")
    // console.log(decode);
    let user = await User.findById(decode.userId)
   
    if(!user){
        return res.json({message: "Invalid Token"});
    }else{
        req.user = user;
        next();
    }
}