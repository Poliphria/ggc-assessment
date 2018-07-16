const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
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

                console.log(`Username: ${userInfo.username} \n Password: ${result}`)
        
                newUser.save(err => {
                    if (err) console.log(err)
                    res.send({ message: 'You just registered!' })
                })
            })
    }
}



// Async function for hashing password using bcrypt. 
// @params: passToaHash (String)
// @returns: hashed password
async function hashPassword(passToHash) {
    let promise = new Promise((resolve, reject) => {
        bcrypt.hash(passToHash, null, null, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })

    let hashedPassword = await promise;

    return hashedPassword
}