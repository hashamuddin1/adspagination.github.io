const express = require('express');
const { views } = require("../models/views");
const app = express();

//Get Total Views
const view_ads = async(req, res) => {
    try {
        const getview = await views.find({})
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "This are all Views";
            let status = true;
            let Data = getview;
            return res.status(201).send({ response: response, message: message, status: status, Data: Data })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.status(400).send({ response: res.statusCode, status: false })
    }
}

//Insert Views
const addviews = async(req, res) => {
    try {
        const addview = await new views({
            ad_Id: req.body.ad_Id,
            ip_Address: req.ip,
            user_Agent: req.headers['user-agent']
        })
        let insertview = await addview.save();
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "The View is added";
            let status = true;
            let Data = insertview;
            return res.status(200).send({ response: response, message: message, status: status, Data: Data })
        }
        helperfunction()
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}

//Count Views Of Advertise
const countview = async(req, res) => {
    try {
        const viewcount = await views.find({}, "ad_Id")
        let helperfunction = () => {
            let response = res.statusCode;
            let message = "This are Total Views Of This Advertise";
            let status = true;
            let Data = viewcount;
            return res.status(201).send({ response: response, message: message, status: status, Total_Views: Data })
        }
        helperfunction()
        console.log(viewcount)
    } catch (e) {
        console.log(e)
        res.status(400).send({ response: res.statusCode, status: false })
    }
}

module.exports = { view_ads, addviews, countview }