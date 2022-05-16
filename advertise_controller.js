const express = require('express');
const { advertise } = require("../models/advertises");
const multer = require("multer");
const upload = multer({ dest: '/uploads/' }).array('files', 2)
const fs = require("fs");
const { Console } = require('console');
const { views } = require("../models/views");
const app = express();

//View all advertise
const getadvertise = async(req, res) => {
    try {
        let response;
        let message;
        let status1;
        let AllAds;
        let { id, status, search, page, size } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 2
        }
        const limit = parseInt(size)
        const skip = (page - 1) * size;
        var regexp = new RegExp("^" + search, "i");
        if (!status && !search) {
            const adslimit = await advertise.find({ user_id: id }).limit(limit).skip(skip);
            const adsids = await advertise.find({ user_id: id }, '_id').limit(limit).skip(skip);
            //console.log(adsids)
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
                datafinal.push(testdata)
            }
            //console.log(datafinal)
            const adslimitcount = await advertise.count()
            let helperfunction = () => {
                response = res.statusCode;
                message = "This is All Advertise without status and title"
                status1 = true;
                res.status(200).send({ page, size, count: adslimitcount, data: datafinal })
            }
            helperfunction()
        } else if (!status) {
            const adslimit = await advertise.find({ user_id: id }).where("title").equals(regexp).limit(limit).skip(skip);
            const adsids = await advertise.find({ user_id: id }, '_id').where("title").equals(regexp).limit(limit).skip(skip);
            //console.log(adsids)
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
                datafinal.push(testdata)
            }
            //console.log(datafinal)
            const adslimitcount = await advertise.count()

            let helperfunction = () => {
                response = res.statusCode;
                message = "This is All Advertise without status"
                status1 = true;
                res.status(200).send({ page, size, count: adslimitcount, data: datafinal })
            }
            helperfunction()
        } else if (!search) {
            const adslimit = await advertise.find({ user_id: id }).where("is_Active").equals(status).limit(limit).skip(skip);
            const adsids = await advertise.find({ user_id: id }, '_id').where("is_Active").equals(status).limit(limit).skip(skip);
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
                datafinal.push(testdata)
            }
            const adslimitcount = await advertise.count()
            let helperfunction = () => {
                response = res.statusCode;
                message = "This is All Advertise without Search"
                status1 = true;
                AllAds = datafinal;
                return res.status(201).send({ page, size, count: adslimitcount, data: datafinal })
            }
            helperfunction()

        } else {
            const adslimit = await advertise.find({ user_id: id }).where("is_Active").equals(status).where("title").equals(regexp).limit(limit).skip(skip);
            const adsids = await advertise.find({ user_id: id }, '_id').where("is_Active").equals(status).where("title").equals(regexp).limit(limit).skip(skip);
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
                datafinal.push(testdata)
            }
            const adslimitcount = await advertise.count()
            let helperfunction = () => {
                response = res.statusCode;
                message = "This is All Advertise including title and statuss"
                status1 = true;
                AllAds = datafinal;
                return res.status(201).send({ page, size, count: adslimitcount, data: datafinal })
            }
            helperfunction()
        }

    } catch (e) {
        console.log(e)
        res.status(400).send({ response: res.statusCode, status: false })
    }
}

//View all availible advertise
const getavailible = async(req, res) => {
    try {
        const getadv = await advertise.find({ is_Deleted: false })
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "This is All Availible Advertise"
            let status = true;
            let Data = getadv;
            return res.status(201).send({ response: response, message: message, status: status, Data: Data })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.status(400).send({ response: res.statusCode, status: false })
    }
}

//create advertise
const addadvertise = async(req, res) => {
    try {
        const path = 'backend/advertiseimages/' + Date.now() + '.jpeg'
        const imgdata = req.body.images;
        // to convert base64 format into random filename
        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(path, base64Data, { encoding: 'base64' });
        console.log(path);
        req.body.images = path;
        const addadv = new advertise({
            user_id: req.params.id,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
            images: req.body.images,
            is_Active: req.body.is_Active,
            deleted_On: req.body.deleted_On,
            is_Deleted: req.body.is_Deleted
        })
        console.log(addadv);
        let insertadv = await addadv.save();
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "Advertise is inserted"
            let status = true;
            let Data = insertadv;
            return res.status(201).send({ response: response, message: message, status: status, Data: Data })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.status(400).send({ response: res.statusCode, status: false })
    }
}

//DELETE ADVERTISE
const deleteadvertise = async(req, res) => {
    try {
        const del = await advertise.findByIdAndDelete(req.params.id)
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "Advertise Is Deleted"
            let status = true;
            return res.status(201).send({ response: response, message: message, status: status })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.status(500).send({ response: res.statusCode, status: false }) //server say jo error ata hay uskay liye
            //500 port hogi OR update krtay waqt 500 port hogi
    }
}

//UPDATE ADVERTISE

const updateadvertise = async(req, res) => {
    try {
        const _id = req.params.id;
        const updadv = await advertise.findByIdAndUpdate(_id, req.body, {
            new: true //new updated value usi waqt mil jae uskay liye kia hay

        })
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "Advertise Is Updated"
            let status = true;
            let Data = updadv;
            return res.status(201).send({ response: response, message: message, status: status, Data: Data })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.status(500).send({ response: res.statusCode, status: false }) //server say jo error ata hay uskay liye
            //500 port hogi OR update krtay waqt 500 port hogi
    }
}

//UPDATE ADVERTISE IS DELETED
const isdeleted = async(req, res) => {
    try {
        const _id = req.params.id;
        let updel = {
            is_Deleted: true,
            deleted_On: Date.now()
        }
        const isdel = await advertise.findByIdAndUpdate(_id, updel, {
            new: true //new updated value usi waqt mil jae uskay liye kia hay

        })
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "Advertise Is Deleted"
            let status = true;
            let Data = isdel;
            return res.status(201).send({ response: response, message: message, status: status, Data: Data })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.status(500).send({ response: res.statusCode, status: false }) //server say jo error ata hay uskay liye
            //500 port hogi OR update krtay waqt 500 port hogi
    }
}

//VIEW SPECIFIC ADVERTISE

const specificadvertise = async(req, res) => {
    try {
        const _id = req.params.id;
        const getspead = await advertise.findById({ _id: _id })
        let helperfunction = () => {
            let response = res.statusCode;
            let status = true;
            let Data = getspead;
            return res.status(201).send({ response: response, status: status, Data: Data })
        }
        helperfunction()

    } catch (e) {
        console.log(e)
        res.status(400).send({ response: res.statusCode, status: false })
    }
}

module.exports = { getadvertise, getavailible, isdeleted, specificadvertise, updateadvertise, deleteadvertise, addadvertise }