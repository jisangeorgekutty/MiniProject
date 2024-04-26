const mongoose = require('mongoose');

const state = {
    db: null
}

module.exports.connect = function () {
    const url = 'mongodb://localhost:27017'
    const dbname = 'musicplayer'

    return mongoose.connect(url, { dbName: dbname })
        .then((client) => {
            state.db = client.connection
            console.log('Database connected successfully')
        })
        .catch((err) => {
            console.log('Error connecting to database: ', err)
        })
}

module.exports.get = function () {
    return state.db
}



