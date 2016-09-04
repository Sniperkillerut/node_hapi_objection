'use strict'

const Boom = require('boom')
const User = require('../models/User')

module.exports = function (request, reply) {
  User
    .find()
    // Deselect the password and version fields
    .select('-password -__v')
    .exec((error, users) => {
      if (error) {
        reply(Boom.badRequest(error))
        return
      }
      if (!users.length) {
        reply(Boom.notFound('No users found!'))
        return
      }
      reply(users)
    })
}