const Joi = require('joi')

module.exports = {
  body: {
    appId: Joi.string().required(),
    value: Joi.number(),
    time: Joi.date().timestamp('unix'), //TODO: note that date is UNIX rather than
    deviceId: Joi.string().required(),
    apiVersion:Joi.string(),
    devMode: Joi.boolean(),
    createDisposition: Joi.string(),
    disposition: Joi.string(),
    appVersion: Joi.string(),
    userId: Joi.string().required(),
    currencyCode: Joi.string()
  }
}
