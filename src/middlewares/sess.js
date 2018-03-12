const session = require('express-session')
const CassandraStore = require('cassandra-store')
const options = {
    "table": "sessions",
    "client": null,
    "clientOptions": {
        "contactPoints": [ "localhost" ],
        "keyspace": "tests",
        "queryOptions": {
            "prepare": true
        }
    }
};
module.exports = () => {
  return session({
    secret: process.env.SESSION_SECRET,
    store: new CassandraStore(options),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
  })
}
