const express = require('express')
const router = express.Router()
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('bodyParser')
const UserModel = require('../models/UserModels.js')

// middleware to use

// only use errorhandler when in development
if (process.env.NODE_ENV == 'development') {
    router.use(errorhandler())
}

router.use(bodyParser.json())
router.use(logger('dev'))

// paths

router.use()


