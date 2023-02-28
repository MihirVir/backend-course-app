const jwt = require('jsonwebtoken')
const {createError} = require('./error')

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("access token = ", token);
    if (!token) {
        console.log(token);
        return res.status(400).json(errorObj =  {message: "error no token available", token: token});
    }
    jwt.verify(token, process.env.KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({message: "token is not valid"});   
        }
        
    req.user = user;
    next();
})
    
}

const verifyUser = (req, res, next) => {
    verifyToken(req,res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            if (err) return res.status(403).json({message: "token is not full of error"});
        }

    })
}

const verifyIsAdmin = (req, res, next) => {
    verifyToken(req,res, next, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            if (err) return res.status(403).json({message: "yo no admin dawg"});
        }

    })
}

module.exports = {
    verifyToken,
    verifyUser,
    verifyIsAdmin
}