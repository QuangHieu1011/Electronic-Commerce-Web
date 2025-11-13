const User = require("../models/UserModel");
const bcrypt = require("bcrypt")

const createUser = (newUser = {}) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser || {};

        if (!name || !email || !password || !confirmPassword || !phone) {
            return reject(new Error('Missing required fields'));
        }

        
        if (password !== confirmPassword) {
            return reject(new Error('Password and confirmPassword do not match'));
        }

        const hash = bcrypt.hashSync(password, 10)
        console.log("hashed password:", hash)
        try {
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
        
            if (e && e.code === 11000) {
                return reject(new Error('Email already exists'));
            }
            reject(e);
        }
    });
};

module.exports = {
    createUser
};