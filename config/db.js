//Database Mongoose Connection
const mongoose = require('mongoose');
require('dotenv').config()
const {MONGO_URL} = process.env

const db = async () =>{
    try {
        await mongoose.connect(MONGO_URL,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            })
            console.log(`MongoDb Connected!`)
    } 
    catch (err) {
        console.log(`Failed to Connect ~ MongoDb!, ERROR: ${err.message}`)
    }
}

module.exports = db()