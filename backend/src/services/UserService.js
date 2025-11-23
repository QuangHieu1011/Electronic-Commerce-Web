const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser = {}) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser || {};

        try {
            const CheckUser= await User.findOne({
                 email: email
            });
            if (CheckUser != null) {
                resolve({
                    status: 'ERR',
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
        const {  email, password} = Userlogin || {};

        try {
            const CheckUser= await User.findOne({
                 email: email
            });
            if (CheckUser === null) {
                resolve({
                    status: 'ERR',
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
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
           const CheckUser = await User.findOne({ _id: id });
            if (CheckUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                });
            }
    
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            });
        } catch (e) {
             reject(e);
        }
    });
};
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
           const CheckUser = await User.findOne({ _id: id });
            if (CheckUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                });
            }
            
            await User.findByIdAndDelete(id);
            
            resolve({
                status: 'OK',
                message: 'Delete user successfully',
            });
        } catch (e) {
             reject(e);
        }
    });
};
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Get all user success',
                data: allUser
            });
        } catch (e) {
             reject(e);
        }
    });
};
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
           const user = await User.findOne({ _id: id });
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                });
            }
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            });
        } catch (e) {
             reject(e);
        }
    });
};
const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
         
            
            await User.deleteMany({ _id: ids });
            
            resolve({
                status: 'OK',
                message: 'Delete user successfully',
            });
        } catch (e) {
             reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser

};