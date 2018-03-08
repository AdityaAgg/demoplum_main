const validate = require('express-validation')
const sessionValidation = require('../../validators/session/session')
const session = require('express-session')

module.exports = (router, app, db) => {

  router.post('/start',
  validate(sessionValidation),
  async (req, res, next) => {
    //recreate the session
    req.session.regenerate(async function(err) {
      console.log(err);

      console.log("reached here");
      //create session data object
      let params = ["appId", "deviceId",  "apiVersion", "devMode", "createDisposition", "appVersion", "userId", "systemName", "location", "userAttributes"]


      //create the session data
      let sessDataObj = {};
      params.forEach(param => {
        sessDataObj[param] = req.body[param];
      });

      req.session.obj = sessDataObj;
      console.log(req.session.obj)


      let resArray = [];
      let user = await db.User.findOne({userId: req.session.obj.userId});
      if(!user) {
        console.log(req.session.obj["createDisposition"]);
        if(req.session.obj["createDisposition"] == "CreateIfNeeded") //if create disposition is create if needed create user
        {
          console.log("user lookup failed")
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
    });

  })


}
