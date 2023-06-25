const Joi = require("joi");

function validateUserData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
        firstName: Joi.string().min(1).max(20).required(),
        lastName: Joi.string().min(1).max(20).optional(),
        identifier: Joi.string().min(5).max(20).required(),
    });
    
    return schema.validate(body);
}

function validateVerificationData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
        code: Joi.string().regex(/^\d{6}$/).required()
    });

    return schema.validate(body);
}

function validatePhoneNumberData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
    });

    return schema.validate(body);
}

module.exports = {
    validatePhoneNumberData: validatePhoneNumberData,
    validateVerificationData: validateVerificationData,
    validateUserData: validateUserData
}