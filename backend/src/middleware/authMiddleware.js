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
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'The authentication'
            });
        }
        if (user?.isAdmin) {
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
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
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


const authAnyUserMiddleware = (req, res, next) => {
    console.log('=== AUTH ANY USER MIDDLEWARE ===');
    console.log('req.headers:', req.headers);
    const authHeader = req.headers.authorization;
    console.log('authHeader:', authHeader);

    if (!authHeader) {
        console.log('No authorization header');
        return res.status(401).json({
            status: 'ERROR',
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    console.log('ACCESS_TOKEN from env:', process.env.ACCESS_TOKEN);

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log('JWT verification error:', err);
            return res.status(401).json({
                status: 'ERROR',
                message: 'The authentication failed'
            });
        }
        console.log('Verified user:', user);
        req.user = user; 
        next();
    });
}
module.exports = {
    authMiddleware,
    authUserMiddleware,
    authAnyUserMiddleware
}