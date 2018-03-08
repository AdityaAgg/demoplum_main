Backend Prototype Inspired by [Leanplum API](https://www.leanplum.com/docs/api/)
===

![Travis](https://travis-ci.org/AdityaAgg/demoplum_main.svg?branch=master)

This is an [express](https://expressjs.com/) app that attempts to replicate some of the functionality described in [Leanplum's API] (https://www.leanplum.com/docs/api/). The provided endpoints are mostly RESTful w/ a few execptions. The backing store is a standard mongodb process and memorystore for the session cache.  It was ported from a backend for a school [group project](https://github.com/anglinb/310-backend) I previously helped create. **This is just for educational purposes (and also because I'm searching for an opportunity @ Leanplum :))**

### Progress

Currently, there is not much to this project. Basic session management has been implemented however using [express-session](https://github.com/expressjs/session); which should serve as a baseline for the rest of the code keeping track of the session.

Completed Features:
* basic session management
  * [start](https://www.leanplum.com/docs/api/production#start)

Optimizations for Completed Features:
* improved test case coverage (unit testing)
* replacement of memory store with redis or cassandra
* better data validation and support for default values described in docs

Future Feature Sets:
* Event tracking
* State tracking

### Getting Started

To get started, make sure you have Node `>= 7.6` installed to handle the `async/await` syntax and make sure you have `mongodb` running on the standard port.

*Note* You will have to modify you `.env` file before all of the server functionality will work.

```
npm install
npm run start:dev
```


*Note*: As mentioned above, you will need to run mongodb in the background. The easiest way to get it is to run `brew install mongodb` and then `brew services start mongodb`.

### Configuration

All the the deployment-specific configuration for the backend stored in a `.env` file in the root directory. The `.env` is written in a standard bash syntax and all the variables in the file get injected into the Node process as enviornment variables. The application can then access these variables through calling `process.env.VARIABLE_NAME`. A sample of this file is provided in `.env-example`. The list below specifies the necessary keys and how to find/set them.

```
SESSION_SECRET="Keyboard-cat" # Secret is used to sign session ids.

```


### File Structure

```

src/ - All the JS source
  controllers/ - RESTful application controllers
    session/ - session management controller
      start/ - to create a new session
      heartbeat/ - route to refresh session cookie

  db/ - Database
    session - session objects
  helpers/ - Assorted helpers
  middlewares/ - express middlewares
    sess/ - middleware for initializing session variable
  routes/ - Wires up all the controllers to HTTP endpoints
  validators/ - Validator configs for routes that need validation

tests/ - All the tests
  int/ - Integration tests
  uint/ - Unit tests

```


### Testing

Currently the nominal functionality is tested for starting a session and refreshing it.

- `npm run test:int` - run integration tests
