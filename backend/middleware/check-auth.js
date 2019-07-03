const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'CACATUA_SECRET_SHOULT_BE_LONGER');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed!' });
    }
};