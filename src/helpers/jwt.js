const jwt = require('jsonwebtoken')
module.exports.create = (payload) => {
  payload.exp(3600000);
  return jwt.sign(payload, process.env.JWT_SECRET)
}
