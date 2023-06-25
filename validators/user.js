const Joi = require("joi");

function validateUserEditData(body) {
    const schema = Joi.object().keys({
        firstName: Joi.string().min(1).max(20).required(),
        lastName: Joi.string().min(1).max(20).optional(),
        identifier: Joi.string().min(5).max(20).optional(),
    });
    
    return schema.validate(body);
}

function validateMessageData(body) {
    const schema = Joi.object().keys({
        chatId: Joi.number().required(),
        chatType: Joi.string().regex(/^(rumor|contact)$/).required(),
        message: Joi.string().min(1).max(1000).optional(),
        image: Joi.optional(),
    });

    return schema.validate(body);
}

function validateReplyData(body) {
    const schema = Joi.object().keys({
        chatId: Joi.number().required(),
        chatType: Joi.string().regex(/^(rumor|contact)$/).required(),
        messageDataId: Joi.number().required(),
        message: Joi.string().min(1).max(1000).optional(),
        image: Joi.optional(),
    });

    return schema.validate(body);
}

function validateForwardData(body) {
    const schema = Joi.object().keys({
        chatId: Joi.number().required(),
        chatType: Joi.string().regex(/^(rumor|contact)$/).required(),
        messageDataId: Joi.number().required(),
    });

    return schema.validate(body);
}

function validateScoreData(body) {
    const schema = Joi.object().keys({
        messageDataId: Joi.number().required(),
        score: Joi.number().required(),
    });

    return schema.validate(body);
}

function validateViewData(body) {
    const schema = Joi.object().keys({
        messageDataId: Joi.number().required(),
    });

    return schema.validate(body);
}

function validateRumorData(body) {
    const schema = Joi.object().keys({
        message: Joi.string().min(1).max(1000).optional(),
        image: Joi.optional(),
    });

    return schema.validate(body);
}

function validateInitialMessageData(body) {
    const schema = Joi.object().keys({
        message: Joi.string().min(1).max(1000).optional(),
        image: Joi.optional(),
        toUserId: Joi.number().required(),
    });

    return schema.validate(body);
}

function validateInteractData(body) {
    const schema = Joi.object().keys({
        lastViewedMessageId: Joi.number().required(),
        currentScrollMessageId: Joi.number().required(),
        chatId: Joi.number().required(),
        chatType: Joi.string().regex(/^(rumor|contact)$/).required(),
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
    validateIdData: validateIdData,
    validateUserEditData: validateUserEditData,
    validateMessageData: validateMessageData,
    validateReplyData: validateReplyData,
    validateForwardData: validateForwardData,
    validateScoreData: validateScoreData,
    validateViewData: validateViewData,
    validateRumorData: validateRumorData,
    validateInitialMessageData: validateInitialMessageData,
    validateInteractData: validateInteractData
}