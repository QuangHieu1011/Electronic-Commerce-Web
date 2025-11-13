const UserService = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        const body = req.body || {};
        const { name, email, password, confirmPassword, phone } = body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = email ? reg.test(email) : false;

        if (!name || !email || !password || !confirmPassword || !phone) {
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

        // Pass the validated body to the service. Service is defensive as well.
        const response = await UserService.createUser(body);
        return res.status(200).json(response);
    } catch (e) {
        console.error('createUser controller error:', e);
        const msg = e && e.message ? e.message : String(e);
        if (msg.includes('Missing') || msg.toLowerCase().includes('required') || msg.toLowerCase().includes('match')) {
            return res.status(400).json({ status: 'ERR', message: msg });
        }
        if (msg.toLowerCase().includes('email already exists') || msg.toLowerCase().includes('duplicate')) {
            return res.status(409).json({ status: 'ERR', message: msg });
        }
        return res.status(500).json({ status: 'ERR', message: msg });
    }
};

module.exports = {
    createUser
};