const validate = require('express-validation')
const trackValidation = require('../../validators/event/track')
const createEvent = require('../../helpers/databaseHelpers/createEvent')
const findSession = require('../../helpers/databaseHelpers/findSession')


//TODO: modularize code --> a lot of repeated code currently

module.exports = (router, app, db) => {

  router.post('/track',
  validate(trackValidation),
  async (req, res, next) => {



    let params = ["appId",  "time", "deviceId",  "apiVersion", "devMode", "createDisposition", "appVersion", "userId", "event"]
    let paramsEvent = ["value", "params", "currencyCode", "event", "userId"]

    let resArray = []
    if(!req.body["disposition"] ||  (req.body["disposition"] !="passive")) { //active or requiredActive

      if(!req.body["disposition"] || (req.body["disposition"] != "active" || req.body["disposition"] != "requiredActive")) { //set active as default
        req.body["disposition"] = "active";
      }

      if(req.session.obj) //if session exists
      {
        params.forEach(param => {
            req.session.obj[param] = req.body[param];
        });

        req.session.obj.events = [];
        let newEventObj = {};

        newEventObj["userId"] = req.sessions.obj["userId"];
        paramsEvent.forEach(param => {
          newEventObj[param] = req.body[param];
        });

        req.session.obj.events.push(newEventObj);

        let resObj = {};
        resObj.success = newEventObj;
        resArray.push(resObj);
        res.status(200).json(resArray);
      } else { //session not alive
        let resObj = {};

        if(req.body["disposition"] == "active") {
          resObj = {error: {message: 'session is not alive'}};
        } else { //ignored if requiredActive
          resObj = {success: {message: 'session is not alive', ignored: true}};
        }

        resArray.push(resObj);
        req.session.destroy(function(err) { //session destroyed
          // cannot access session here
          res.status(200).json(resArray);
        })
      }

      //TODO: determine how to sync session data asynchronously after request

    } else { //passive







      req.session.destroy(function(err) {

        if(findSession(req.body["userId"], db) != null) { //check if user exists

          //TODO: update user?


          //create event
          let newEventObj = {};
          newEventObj["userId"] = req.body["userId"];
          paramsEvent.forEach(param => {
            newEventObj[param] = req.body[param]
          });

          createEvent(newEventObj, db);


          //log event
          let resObj = {};
          resObj.success = newEventObj;
          resArray.push(resObj);
          res.status(200).json(resArray);

        } else {
          if(req.body["createDisposition"] == "CreateIfNeeded") //if create disposition is create if needed create user
          {

            //create user
            let sessionDataObj = {};
            params.forEach(param => {
                sessionDataObj[param] = req.body[param];
            });
            let sessionData = new db.Session(Object.assign({}, sessionDataObj));
            await sessionData.save(); //save user


            //create event
            let newEventObj = {};
            newEventObj["userId"] = req.body["userId"];
            paramsEvent.forEach(param => {
              newEventObj[param] = req.body[param]
            });

            createEvent(newEventObj, db);

            //log event
            let resObj = {};
            resObj.success = newEventObj;
            resArray.push(resObj);
            res.status(200).json(resArray);

          }
          else
          {

            let resObj = {warning: {message: 'user does not exist, session not active, and create disposition is set to "CreateIfNeeded"'}};
            resArray.push(resObj);
            res.status(200).json(resArray);

          }
        }


      });







    }

  })


}
