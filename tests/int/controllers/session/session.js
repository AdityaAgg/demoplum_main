const request = require('supertest')
const expect = require('chai').expect
const app = require('../../../../')
const jwt = require('jsonwebtoken')

describe('[controller] session', () => {
  beforeEach(async () => {
    let conn = await app.db.mongo.connection()
    return conn.dropDatabase()
  })
  describe('without an session', () => {
    it('should start a new session', async () => {
      await request(app)
        .post('/start')
        .send({ "appId": "test2",
                "deviceId": "test",
                "apiVersion": "1.0.6",
                "devMode": true,
                "createDisposition": "CreateIfNeeded",
                "appVersion": "2.0",
                "userId": "1233"
        })
        .expect(200)
      let userSession = await app.db.Session.findOne({ userId: '1233' })
      console.log(userSession)
      expect(userSession).not.to.be.a('null')
      expect(userSession.get('appId')).to.eql("test2")
      expect(userSession.get('deviceId')).to.eql("test")
      expect(userSession.get('appVersion')).to.eql("2.0")


    })
    it('should return same data', async () => {
      await request(app)
        .post('/start')
        .send({ "appId": "test2",
                "deviceId": "test",
                "apiVersion": "1.0.6",
                "devMode": true,
                "createDisposition": "CreateIfNeeded",
                "appVersion": "2.0",
                "userId": "1233"
        }).expect(200)
      await request(app)
        .post('/heartbeat')
        .send({ "appId": "test2",
                "deviceId": "test",
                "apiVersion": "1.0.6",
                "devMode": true,
                "createDisposition": "CreateIfNeeded",
                "appVersion": "2.0",
                "userId": "1233"
        })
        .expect(200)
      let userSession = await app.db.Session.findOne({ userId: '1233' })
      console.log(userSession)
      expect(userSession).not.to.be.a('null')
      expect(userSession.get('deviceId')).to.eql("test")
      expect(userSession.get('appVersion')).to.eql("2.0")


    })
  })
  
  describe('without an existing session', () => {

    it('should warn that session is not alive', async () => {
      await request(app)
        .post('/heartbeat')
        .send({ "appId": "test2",
                "deviceId": "test",
                "apiVersion": "1.0.6",
                "devMode": true,
                "createDisposition": "CreateIfNeeded",
                "appVersion": "2.0",
                "userId": "1233"
        })
        .expect(200)
        .expect(res => {
          expect(res.body[0].error.message).to.eql('session is not alive')
        })



    })
  })



})
