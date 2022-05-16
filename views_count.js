const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating schema of views count
const views_count = new mongoose.Schema({
    ad_Id: {
        type: Schema.Types.ObjectId,
        ref: "Advertise"
    },
    views_id: {
        type: Schema.Types.ObjectId,
        ref: "View"
    },
    user_Agent: {
        type: String,
        required: true,
    }

})

//creating collection
const views_cou = new mongoose.model('views_count', views_count)

//export collection
module.exports = { views_cou };