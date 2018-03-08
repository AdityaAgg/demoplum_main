const validate = require('express-validation')
const authenticationValidation = require('../../validators/authentication/authentication')
const sess = require('../../middlewares/sess')


module.exports = (router, app, db) => {

  router.post('/start',
  validate(authenticationValidation),
  sess(),
  async (req, res, next) => {

    //recreate the session
    req.session.regenerate(function(err) {
      console.log(err);
    });

    //create session data object
    let params = ["appId", "deviceId",  "apiVersion", "devMode", "createDisposition", "appVersion", "userId", "systemName", "location", "userAttributes"]


    //create the session data
    let sessDataObj = params=>map((param) => {
      let obj = {};
      obj[param] = req.body[param];
      return obj;
    }, {});

    req.session.obj = sessDataObj;



    let resArray = [];
    let user = await db.User.findOne({userId: req.session.obj.userId});
    if(user) {
      if(createDisposition == "CreateIfNeeded") //if create disposition is create if needed create user
      {
        let user = new db.User(Object.assign({}, req.session.obj));
        await user.save(); //save user
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
    } else {
      params.forEach((param) => {
        if (req.session.obj[param]) {
          user.set(param, req.session.obj[param])
        }
      });

      await user.save();

      let resObj = {};
      resObj.success = user.toJSON();
      resArray.push(resObj);
      res.status(200).json(resArray);
    }
  })


}
