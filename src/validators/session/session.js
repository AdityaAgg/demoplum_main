const Joi = require('joi')

module.exports = {
  body: {
    appId: Joi.string().required()
    deviceId: Joi.string().required(),
    apiVersion:Joi.string(),
    devMode: Joi.boolean(),
    createDisposition: Joi.string(),
    appVersion: Joi.string(),
    userId: Joi.string.required(),
    systemName: Joi.string(), //TODO: check if this is true, presuming this means Operating systemName
    location: Joi.string()
  }
}
