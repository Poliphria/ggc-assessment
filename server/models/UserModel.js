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