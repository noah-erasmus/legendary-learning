const jwt = require('jsonwebtoken');

module.exports = function (request, response, next) {
    // var passcode = 'super-secret';
    // if (request.query.passcode === passcode) {
    //     next();
    // } else {
    //     response.send(401);
    // }

    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return response.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return response.sendStatus(403);

        request.user = user;
        next();
    });
};