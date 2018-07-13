const express = require('express')
const app = express()

// routes
const userRoutes = require('./routes/userRouter.js')

// paths
app.use('/', userRoutes)

app.listen(8080, function() {
    console.log('Listening on port 8080')
})