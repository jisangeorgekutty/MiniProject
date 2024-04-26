const db = require('../config/connection')
const collections = require('../config/collections')
const { resolve } = require('promise')
var bcrypt = require('bcrypt')
const async = require('hbs/lib/async')
const { response } = require('../app')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ Email: userData.Email });
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    doForgotpass: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            if (userData.Password == userData.Password1) {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                db.get().collection(collections.USER_COLLECTION).updateOne({ Email: userData.Email },
                    { $set: { Password: userData.Password } }).then(() => {
                        response.status = true
                        resolve(response)
                    })
            } else {
                response.status = false
                resolve(response)
            }
        })
    }
}