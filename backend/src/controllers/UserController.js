const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService');

const createUser = async (req, res) => {
    try {
        const body = req.body || {};
        const { name, email, password, confirmPassword, phone } = body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = email ? reg.test(email) : false;

        if ( !email || !password || !confirmPassword ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input must be a valid email'
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Password and confirmPassword must match'
            });
        }

        const response = await UserService.createUser(body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || e
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const body = req.body || {};
        const {email, password } = body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = email ? reg.test(email) : false;

        if ( !email || !password ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input must be a valid email'
            });
        } 
        const response = await UserService.loginUser(body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const UserId = req.params.id;
        const data = req.body;
        if(!UserId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The UserId is required'
            });
        }

        const response = await UserService.updateUser(UserId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const UserId = req.params.id;
        if(!UserId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The UserId is required'
            });
        }

        const response = await UserService.deleteUser(UserId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const getDetailsUser = async (req, res) => {
    try {
        const UserId = req.params.id;
        if(!UserId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The UserId is required'
            });
        }

        const response = await UserService.getDetailsUser(UserId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const refreshToken = async (req, res) => {
    try {
        const token = req.headers.token.split(' ')[1]
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            });
        }

        const response = await JwtService.RefreshTokenJwtService(token)
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
};