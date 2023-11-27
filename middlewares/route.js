import jwt from "jsonwebtoken"

const myLogger = (req, res, next) => {

    if (req.session.userId) {

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next()
    } else {
        res.send('Please login again to access the dashboard page')
    }
}

const jwt_secret_key = 'wfeykgvywefv64weyuJVCHsdh46'

const verifyToken = (req, res, next) => {

    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, jwt_secret_key, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized');
            } else {
                req.userID = decoded;

                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                next();
            }
        });
    } else {
        res.status(401).send('Unauthorized');
    }
};

export { myLogger, verifyToken }