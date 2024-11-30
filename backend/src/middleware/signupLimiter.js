import rateLimit from 'express-rate-limit';

export const signupLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes window
    limit: 5, // start blocking after 5 requests
    message: 'Too many accounts created from this IP, please try again after 5 minutes'
});

module.exports = signupLimiter;