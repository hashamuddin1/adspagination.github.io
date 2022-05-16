const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating schema of views
const views_schema = new mongoose.Schema({

    ad_Id: {
        type: Schema.Types.ObjectId,
        ref: "advertises"
    },
    ip_Address: {
        type: String,
        required: true,
    },
    user_Agent: {
        type: String,
        required: true
    },
    countview: {
        type: Number
    }

})

//creating collection
const views = new mongoose.model('views', views_schema)

//export collection
module.exports = { views };