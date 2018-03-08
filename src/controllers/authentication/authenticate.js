const validate = require('express-validation')
const authenticationValidation = require('../../validators/authentication/authentication')
const session = require('express-session')


module.exports = (router, app, db) => {

  router.post('/start',
  validate(authenticationValidation),
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
  }),
  async (req, res, next) => {

    //restarts/reloads every time on start


    let params = ["appId", "deviceId",  "apiVersion", "devMode", "createDisposition", "appVersion", "userId", "systemName", "location", "userAttributes"]

    //create session data object

    let sessDataObj = params=>map((param) => {
      let obj = {};
      obj[param] = req.body[param];
      return obj;
    }, {});

    req.session.obj = sessDataObj;
    let resArray = [];
    let user = await db.User.findOne({userId: req.session.obj.userId});
    if(user) {
      if(!success) {
        if(createDisposition == "CreateIfNeeded")
        {

          let user = new db.User(Object.assign({}, req.session.obj));
          let resObj = {};
          resObj.success = user.toJSON();
          resArray.push(resObj);
          res.status(200).json(resArray);
        }
        else
        {
          let resObj = {warning: {message: 'user does not exist and create disposition is set to "CreateIfNeeded"'}};
          resArray.push(resObj);
          res.status(200).json(resArray);
        }
      }
    }



    let username = req.body.username.toLowerCase()
    const data = {
      username
    }



    let user = await db.User.findOne({ username: data.username })
    if (user) {
      if (!success) {
        res.status(401).json({ error: { msg: 'Invalid password', error: 'invalid_password' } })
      } else {
        sendJWT(user, res)
      }
    } else {
      let newUser = new db.User({
        username: data.username
      })
      await newUser.save()
      sendJWT(newUser, res)
    }
  })


}
