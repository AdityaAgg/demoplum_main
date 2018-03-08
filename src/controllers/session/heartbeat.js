const validate = require('express-validation')
const sessionValidation = require('../../validators/session/session')
const sess = require('../../middlewares/sess')


module.exports = (router, app, db) => {

  router.post('/heartbeat',
  validate(sessionValidation),
  sess(),
  async (req, res, next) => {


    req.session.touch(); //refresh the session

    //create session data object
    let params = ["appId", "clientKey", "deviceId",  "apiVersion", "devMode", "createDisposition",  "userId"]
    let resArray = [];


    //check if the session is not alive
    if(!req.session.obj)
    {
      let resObj = {error: {message: 'session is not alive'}};
      resArray.push(resObj);
      res.status(200).json(resArray);
    }


    //find a user
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


      let saveNeeded = false;
      params.forEach((param) => {
        if (req.session.obj[param]) {
          if(req.session.obj[param] != res.body[param]) {
            user.set(param, req.session.obj[param])
            saveNeeded = true;
          }
        }
      });


      if(saveNeeded)
        await user.save();

      let resObj = {};
      resObj.success = user.toJSON();
      resArray.push(resObj);
      res.status(200).json(resArray);

    }
  })


}
