const express = require('express')
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const files = require('./routes/models')
app.use(files)

module.exports = {
  path: '/api/models',
  handler: app
}