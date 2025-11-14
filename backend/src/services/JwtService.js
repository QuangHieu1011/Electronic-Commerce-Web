const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()

const genneralAccessToken = async(payload) => {
    const access_token =jwt.sign({
        payload
    },process.env.ACCESS_TOKEN, { expiresIn:'30s'})
    return access_token
}

const genneralRefreshToken = async(payload) => {
    const refresh_token =jwt.sign({
        payload
    },process.env.REFRESH_TOKEN, { expiresIn:'365d'})
    return refresh_token
}

const RefreshTokenJwtService = (token) => {
     return new Promise((resolve, reject) => {
        try {
        console.log("Received token:", token)
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
            if (err) {
                resolve({
                    status: 'ERROR',
                    message: 'The authentication'
                });
            }
            const { payload } = user;
            const access_token = await genneralAccessToken({
                id:payload?.id,
                isAdmin: payload?.isAdmin
            })  
            console.log("access token:", access_token)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token
            });
        })
    
        } catch (e) {
             reject(e);
        }
    });
}

module.exports= {
    genneralAccessToken,
    genneralRefreshToken,
    RefreshTokenJwtService
}