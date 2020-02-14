const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup redis
const redisClient = redis.createClient(process.env.REDIS_URL);

// Higher order function
const handleSigninAuthentication = (db, bcrypt) => (req, res) => {
    // Gets the JWT token in req header 
    const { authorization } = req.headers;
    return authorization
        ? getAuthTokenId()
        : handleSignin(req, res, db, bcrypt)
            .then(data => {
                return data.id && data.email
                    ? createSessions(data)
                    : Promise.reject(data)
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err))
}

const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject("Incorrect form submission")
    }

    return db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(() => Promise.reject('unable to get user'))
            } else {
                Promise.reject('Wrong credentials')
            }
        })
        .catch(() => Promise.reject('Wrong credentials'))
}

const getAuthTokenId = () => {
    console.log('Auth Ok')
}

const createSessions = (user) => {
    // JWT token and return User data
    const { id, email } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return {
                success: true,
                userId: id,
                token
            }
        })
        .catch(err => console.log(err))
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value))
}

const signToken = (data) => {
    const jwtPayload = { data };
    return jwt.sign(jwtPayload, 'JWT-SECRET', { expiresIn: '2 days' }); // should be in env var
}

module.exports = {
    handleSigninAuthentication
};