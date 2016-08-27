'use strict';

const Joi = require('joi');
//Joi.objectId = require('joi-objectid')(Joi);

const payloadSchema = Joi.object({
    username: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().email(),
    scope: Joi.string().allow('User', 'Premium', 'Admin')
});

const paramsSchema = Joi.object({
    id: Joi.number().integer().required()
    //id: Joi.objectId().required()
});

module.exports = {
    payloadSchema: payloadSchema,
    paramsSchema: paramsSchema
};