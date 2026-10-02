const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : null;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
};

module.exports = verifyToken;