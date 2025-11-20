const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 'ERROR',
            message: 'No token provided'
        });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token , process.env.ACCESS_TOKEN, function(err,user) {
        if(err){
            return res.status(401).json({
                status: 'ERROR',
                message: 'The authentication'
            });
        }
        if(user?.isAdmin){
            next()
        } else {
            return res.status(401).json({
                status: 'ERROR',
                message: 'The authentication'
            });
        }
    });
}
const authUserMiddleware = (req, res, next) => {
    console.log('req.header', req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 'ERROR',
            message: 'No token provided'
        });
    }
    const token = authHeader.split(' ')[1];
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'The authentication'
            });
        }
        console.log('user', user);
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(401).json({
                status: 'ERROR',
                message: 'The authentication'
            });
        }
    });
}
module.exports ={
    authMiddleware,
    authUserMiddleware
}