const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const saltRounds = 10;
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true})


const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, requried: true},
    dateRegistered: {type: Date, default: Date.now()}
})

const User = mongoose.model('User', userSchema)

module.exports = {
    userSchema: User,
    saveUser: function(req, res, userInfo) {
        hashPassword(userInfo.password)
            .then(result => {
                let newUser = new User({
                    username: userInfo.username,
                    password: result
                })

                console.log(`Username: ${userInfo.username} \nPassword: ${result}`)
        
                newUser.save((err) => {
                    if (err) res.status(500).send("internal server error")
                    console.log('User Saved!')
                    res.status(200).send({ message: "User saved"})
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).send({ error: err.message })
            })
    },
    login: function(req, res, userInfo) {
        // Use the username to find the user in the database
        User.findOne({username: userInfo.username}, {password: 1, _id: 0}, (err, document) => {
            if (err) res.status(500).send({ error: 'which' })
            if (document) {
                comparePass(userInfo.password, document.password)
                    .then(match => {
                        console.log("Matches type is:", typeof match)
                        console.log("Match is: ", match)
                        if (match) res.redirect(302, '/home')
                        else res.status(400).send({ message: 'Invalid login credentials'})
                    })
                    .catch(err => console.log(err))
            } else {
                res.status(400).send({message: 'Invalid login credentials'})
            }
        })
    }
}



// Async function for hashing password using bcrypt. 
// @params: passToaHash (String)
// @returns: hashed password (String)
async function hashPassword(passToHash) {
    let promise = new Promise((resolve, reject) => {
        bcrypt.hash(passToHash, saltRounds, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        })
    })

    let hashedPassword = await promise;

    return hashedPassword
}


async function comparePass(passToCompare, hashedPass) {
    let promise = new Promise((resolve, reject) => {
        bcrypt.compare(passToCompare, hashedPass, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
    
    let isMatch = await promise
    
    return isMatch
}

