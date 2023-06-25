const Joi = require("joi");

function validateLoadData(body) {
    const schema = Joi.object().keys({
        chatId: Joi.number().required(),
        chatType: Joi.string().regex(/^(rumor|contact)$/).required(),
    });

    return schema.validate(body);
}

function validateSearchData(body) {
    const schema = Joi.object().keys({
        identifier: Joi.string().min(5).max(20).required(),
    });

    return schema.validate(body);
}

function validateIdData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required(),
    });

    return schema.validate(body);
}

module.exports = {
    validateLoadData: validateLoadData,
    validateSearchData: validateSearchData,
    validateIdData: validateIdData
}