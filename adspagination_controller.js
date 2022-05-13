const express = require('express');
const { advertise } = require("../models/advertises");
const { views } = require("../models/views");
const app = express();

const limited_ads = async(req, res) => {
    try {
        let { page, size } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 2
        }

        const limit = parseInt(size)
        const skip = (page - 1) * size; //iska matlab ye k jab user page 1 may hoga tw ek bhi ad skip nhi hoga jab page 2 may hoga tab 2 ads skip hogay jab page 3 may hoga tw 4 ads skip hogay and so on
        const ads_id = await advertise.find({}, '_id')
        const adslimit = await advertise.find().limit(limit).skip(skip);
        const adsids = await advertise.find({}, '_id').limit(limit).skip(skip);
        var datafinal = []
        for (var i in adsids) {
            var query = await views.count({ ad_Id: adsids[i] });
            var testdata = {}

            testdata.title = adslimit[i].title;
            testdata.price = adslimit[i].price;
            testdata.description = adslimit[i].description;
            testdata.images = adslimit[i].images;
            testdata.posted_On = adslimit[i].posted_On;
            testdata.is_Active = adslimit[i].is_Active;
            testdata.views = query;
            console.log(testdata);
            datafinal.push(testdata)
        }
        console.log(datafinal)
        const adslimitcount = await advertise.count()
        res.status(200).send({ page, size, count: adslimitcount, data: datafinal })

    } catch (e) {
        console.log(e)
        return res.status(400).send(e)
    }
}

module.exports = { limited_ads }