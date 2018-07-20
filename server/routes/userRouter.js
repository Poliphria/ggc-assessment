const express = require('express')
const router = express.Router()
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const UserModel = require('../models/UserModel.js')

// middleware to use
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(logger('dev'))

// only use errorhandler when in development
if (process.env.NODE_ENV == 'development') {
    router.use(errorhandler())
}

// paths
router.get('/login', (req, res) => {
    res.send({ message: 'This is the login page!'})
})

router.route('/login')
    .get((req, res) => {
        res.send({ message: 'This is the login page!'})
    })
    .post((req, res) => {
        let loginInfo = req.body
        
        // if the login info is empty or null then return an error
        if (isEmpty(loginInfo.email) || isEmpty(loginInfo.password)) {
            res.status(401).send({ message: 'Invalid login credentials'})
        }
        
    })

router.route('/register')
    .get((req, res) => res.send({ message: 'This is the register page!'}))
    .post((req, res) => {
        if (isEmpty(req.body.username) || isEmpty(req.body.password)) {
            res.status(400).send({ message: "Invalid username or password" })
        } else {
            UserModel.saveUser(req, res, req.body)
        }
    })
    
function isEmpty(string) {
    if (!string || string.length === 0 || string === null || string === undefined) {
        return true
    }
    return false;
}

module.exports = router