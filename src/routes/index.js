const home = require('../controllers/home')
const authentication = require('../controllers/authentication')


const autenticationMiddlewareFactory = require('../middlewares/auth')
const setBudgetMiddlewareFactory = require('../middlewares/setBudget')
const setBudgetAndAuthMiddlewareFactory = require('../middlewares/authBudgetNoUser')
const setCategoryMiddlewareFactory = require('../middlewares/setCategory')
const setTransactionMiddlewareFactory = require('../middlewares/setTransaction')

module.exports = (app, db) => {
  let autenticationMiddleware = autenticationMiddlewareFactory(app, db)
  let setBudgetMiddleware = setBudgetMiddlewareFactory(app, db)
  let setBudgetNoUserMiddleware = setBudgetAndAuthMiddlewareFactory(app, db)
  let setCategoryMiddleware = setCategoryMiddlewareFactory(app, db)
  let setTransactionMiddleware = setTransactionMiddlewareFactory(app, db)


  

  app.use('')
  app.use('/', home(app, db))
  app.use('/', authentication(app, db))



}
