const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = (newUser = {}) => {
    return new Promise(async (resolve, reject) => {
        const { name, password, phone } = newUser || {};
        const email = (newUser.email || '').toLowerCase().trim();

        try {
            const CheckUser = await User.findOne({
                email: email
            });
            if (CheckUser != null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already '
                });
            }
            const hash = bcrypt.hashSync(password, 10)
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
        const { password } = Userlogin || {};
        const email = (Userlogin.email || '').toLowerCase().trim();

        try {
            const CheckUser = await User.findOne({
                email: email
            });
            if (CheckUser === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                });
            }
            const ComparePassword = bcrypt.compareSync(password, CheckUser.password);

            if (!ComparePassword) {
                return resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                });
            }
            const access_token = await genneralAccessToken({
                id: CheckUser._id,
                isAdmin: CheckUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: CheckUser._id,
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
const getChatbotToken = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userId });

            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
                return;
            }

            const jwt = require('jsonwebtoken');
            const secret = process.env.CHATBOT_IDENTITY_SECRET;

            if (!secret) {
                reject(new Error('CHATBOT_IDENTITY_SECRET is not configured'));
                return;
            }

            const token = jwt.sign(
                {
                    user_id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                },
                secret,
                { expiresIn: '1h' }
            );

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                token: token
            });
        } catch (e) {
            reject(e);
        }
    });
};

const normalizeGmail = (email) => {
    const [local, domain] = email.split('@');
    if (domain && domain.toLowerCase() === 'gmail.com') {
        return local.replace(/\./g, '').toLowerCase() + '@gmail.com';
    }
    return email.toLowerCase();
};

const googleLogin = (credential) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { name, picture } = payload;
            const email = (payload.email || '').toLowerCase().trim();

            // Tìm exact email trước
            let user = await User.findOne({ email });

            // Nếu không thấy và là gmail, tìm theo dạng bỏ dấu chấm (gmail dot alias)
            if (!user && email.endsWith('@gmail.com')) {
                const normalizedEmail = normalizeGmail(email);
                const gmailUsers = await User.find({ email: { $regex: /@gmail\.com$/i } });
                user = gmailUsers.find(u => normalizeGmail(u.email) === normalizedEmail) || null;
            }

            if (!user) {
                const randomPassword = crypto.randomBytes(32).toString('hex');
                const hash = bcrypt.hashSync(randomPassword, 10);
                user = await User.create({ name, email, password: hash, avatar: picture });
            }

            const access_token = await genneralAccessToken({ id: user._id, isAdmin: user.isAdmin });
            const refresh_token = await genneralRefreshToken({ id: user._id, isAdmin: user.isAdmin });

            resolve({ status: 'OK', message: 'SUCCESS', access_token, refresh_token });
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
    deleteManyUser,
    getChatbotToken,
    googleLogin
}
