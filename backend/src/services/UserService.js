const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser = {}) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser || {};

        if (!name || !email || !password || !confirmPassword || !phone) {
            return reject(new Error('Missing required fields'));
        }
        try {
            const CheckUser= await User.findOne({
                 email: email
            });
            if (CheckUser != null) {
                resolve({
                    status: 'OK',
                    message: 'The email is already '
                });
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log("hashed password:", hash)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            });

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                });
            } else {
                reject(new Error('Failed to create user'));
            }
        } catch (e) {
             reject(e);
        }
    });
};
const loginUser = (Userlogin = {}) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = Userlogin || {};

        try {
            const CheckUser= await User.findOne({
                 email: email
            });
            if (CheckUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                });
            }
            const ComparePassword = bcrypt.compareSync(password, CheckUser.password);
            
            if (!ComparePassword) {
                resolve({
                    status: 'OK',
                    message: 'The password or user is incorrect'
                });
            }
            const access_token = await genneralAccessToken({
                id:CheckUser._id,
                isAdmin: CheckUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id:CheckUser._id,
                isAdmin: CheckUser.isAdmin
            })
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            });
        } catch (e) {
             reject(e);
        }
    });
};


module.exports = {
    createUser,
    loginUser
};