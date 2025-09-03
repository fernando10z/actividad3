const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devsecret';
function sign(payload, exp='2h'){ return jwt.sign(payload, secret, { expiresIn: exp }); }
function verify(token){ return jwt.verify(token, secret); }
module.exports = { sign, verify };
