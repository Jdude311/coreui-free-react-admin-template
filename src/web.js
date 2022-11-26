const fs = require('fs')
const express = require('express')
const app = express()
const rateLimit = require('express-rate-limit')

const config = JSON.parse(fs.readFileSync("./config/config.json").toString())

const run = () => {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: config.webserver.limit,
    message: {error: 'You have exceeded the requests in 1 min limit! Please try again soon.'},
    headers: true,
  })

  const rateLimiter = (req, res, next) => {
    // apply rate limiter middleware
    limiter(req, res, next);
  }

  const port = config.webserver.port
  app.use(rateLimiter);
  app.get('/sensors', (req, res) => {
    // TODO(subham): add support for fetching sensor data with unix time constraints
  })

  app.get('*', (req, res) => {
    res.send({
      error: 404,
      message: 'Oopsie, seems like your code has an error :(.'
    })
  })

  app.listen(port)
}

module.exports = {
  run
}
