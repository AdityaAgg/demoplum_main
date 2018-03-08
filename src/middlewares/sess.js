const session = require('express-session')


module.exports = () => {
  return async session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
  })
}
