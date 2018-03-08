const validate = require('express-validation')
const sessionValidation = require('../../validators/session/session')

module.exports = (router, app, db) => {

  router.post('/heartbeat',
  validate(sessionValidation),
  async (req, res, next) => {



    //create session data object
    let params = ["appId", "clientKey", "deviceId",  "apiVersion", "devMode", "createDisposition",  "userId"]
    let resArray = [];

    req.session.touch(); //refresh the session
    //check if the session is not alive
    if(!req.session.obj)
    {
      let resObj = {error: {message: 'session is not alive'}};
      resArray.push(resObj);
      req.session.destroy(function(err) { //accidentally session destroyed
        // cannot access session here
        res.status(200).json(resArray);
      })

    }




    //find a user

    let sessionData = await db.Session.findOne({userId: req.session.obj.userId});


    if(!sessionData) {
      console.log(req.session.obj["createDisposition"]);
      if(req.session.obj["createDisposition"] == "CreateIfNeeded") //if create disposition is create if needed create user
      {

        let sessionData = new db.Session(Object.assign({}, req.session.obj));
        await sessionData.save(); //save user
        let resObj = {};
        resObj.success = sessionData.toJSON();
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
      params.forEach(param => {
        if (req.session.obj[param] != undefined) {
          if(req.session.obj[param] != req.body[param]) {
            sessionData.set(param, req.session.obj[param])
            saveNeeded = true;

          }
        }
      });

      if(saveNeeded)
          await sessionData.save();

      let resObj = {};
      resObj.success = sessionData.toJSON();
      resArray.push(resObj);
      res.status(200).json(resArray);

    }
  })


}
