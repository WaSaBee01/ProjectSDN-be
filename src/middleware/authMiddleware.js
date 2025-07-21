const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    // Nhận cả token và authorization cho linh hoạt FE/BE
    const bearerToken = req.headers.token || req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).json({
            status: 'ERR',
            message: 'No token provided'
        });
    }
    // "Bearer xyz..."
    const parts = bearerToken.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            status: 'ERR',
            message: 'Invalid token format'
        });
    }
    const token = parts[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERR',
                message: 'The authentication failed'
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'Not authorized'
            });
        }
    });
};

const authUserMiddleware = (req, res, next) => {
    const bearerToken = req.headers.token || req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).json({
            status: 'ERR',
            message: 'No token provided'
        });
    }
    const parts = bearerToken.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            status: 'ERR',
            message: 'Invalid token format'
        });
    }
    const token = parts[1];
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERR',
                message: 'The authentication failed'
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'Not authorized'
            });
        }
    });
};

module.exports = {
    authMiddleware,
    authUserMiddleware
};
