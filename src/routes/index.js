const home = require('../controllers/home')
const session = require('../controllers/session')


//const autenticationMiddlewareFactory = require('../middlewares/auth')
//const setBudgetMiddlewareFactory = require('../middlewares/setBudget')
const sessionMiddlewareFactory = require('../middlewares/sess');

module.exports = (app, db) => {
  let sessionMiddleware = sessionMiddlewareFactory();




  app.use('/',  home(app, db))
  app.use('/', sessionMiddleware, session(app, db))



}
