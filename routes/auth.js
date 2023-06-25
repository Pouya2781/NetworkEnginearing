const request = require('request');
const { VerificationCode, User } = require("../models");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middleware/auth");
const ver = require("../middleware/ver");
const asyncMiddleware = require("../middleware/async");
const { validatePhoneNumberData, validateVerificationData, validateUserData } = require("../validators/auth");
const express = require("express");
const { DATE } = require('sequelize');
const router = express.Router();

const smsTimeout = config.get("sms.timeout")
const jwtPrivateKey = config.get("jwt.private_key");

router.get("/check", auth, (req, res) => {
    res.status(200).json({ data: { id: req.user.id }, status: "ok", message: "User is already logged in!" });
});

router.post("/number", asyncMiddleware(async (req, res) => {
    const { error } = validatePhoneNumberData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    // Checking if user already exists
    const user = await User.findOne({
        where: {
            phoneNumber: req.body.phoneNumber
        }
    });

    const code = rng(100000, 999999);
    /*

     Sending verification code

    */

    // Removing previous entry
    await VerificationCode.destroy({
        where: { phoneNumber: req.body.phoneNumber },
    });

    // storing new entry in verification table in database
    const verCode = await VerificationCode.create({ phoneNumber: req.body.phoneNumber, verificationCode: code });

    res.status(200).json({
        data: {..._.pick(verCode, ["phoneNumber"]), code: code},
        message: "Verification code successfully sent!",
        status: "ok"
    });
}));

router.post("/code", asyncMiddleware(async (req, res) => {
    const { error } = validateVerificationData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    // Checking verification code
    const entry = await VerificationCode.findOne({
        where: {
            phoneNumber: req.body.phoneNumber,
            verificationCode: req.body.code
        }
    });
    if (entry == null) {
        return res.status(400).json({ status: "invalid_code", message: "Invalid verification code!" });
    }
    const timeDifference = getTimeDifference(entry.dataValues.createdAt) / 1000;
    console.log(timeDifference);
    if (timeDifference > smsTimeout) {
        return res.status(400).json({ status: "expired_code", message: "Verification code has been expired!" });
    }

    // Checking if user already exists
    const user = await User.findOne({
        where: {
            phoneNumber: req.body.phoneNumber,
        }
    });
    if (user == null) {
        const token = jwt.sign({ phoneNumber: req.body.phoneNumber }, jwtPrivateKey);
        res.set('x-ver-token', token);
        return res.status(200).json({ status: "need_sign_up", message: "Verification code is correct and user needs to sign up!" });
    }

    const token = jwt.sign({ id: user.id }, jwtPrivateKey);
    res.set('x-auth-token', token);
    res.status(200).json({ data: { id: user.id }, status: "ok", message: "Verification code is correct!" });
}));

router.post("/add", ver, asyncMiddleware(async (req, res) => {
    const { error } = validateUserData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    if (req.body.phoneNumber != req.phoneNumber) {
        return res.status(400).json({
            status: "PhoneNumber_mismatch",
            message: "The phone number supplied to API doesn't match the phone number entered during verification!"
        });
    }

    // Adding new user and its wallet to database
    let newUser;
    try {
        newUser = await User.create({
            phoneNumber: req.body.phoneNumber,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            identifier: req.body.identifier,
        });
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    const token = jwt.sign({ id: newUser.id }, jwtPrivateKey);
    res.set('x-auth-token', token);
    res.status(200).json({
        data: _.pick(newUser, ["phoneNumber", "firstName", "lastName", "identifier", "id"]),
        message: "New user added!",
        status: "ok"
    });
}));

function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getTimeDifference(timeStamp) {
    return new Date().getTime() - new Date(timeStamp);
}

module.exports = router;