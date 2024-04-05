const Redis = require('ioredis');

// const redis = new Redis({
//   host: process.env.REDIS_HOST,  
//   port: 6379
// });

function redisMiddleware(req, res, next) {
    // req.redis = redis;
    next();
}
module.exports = redisMiddleware
