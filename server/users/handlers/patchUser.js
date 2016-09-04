'use strict'

const Boom        = require('boom')
const createToken = require('../util/userFunctions').createToken
const Common      = require('../users/util/common')
const User        = require('../users/models/User')

module.exports = function (request, reply) {
  const id = request.params.id
  User
    .findOneAndUpdate({ _id: id }, request.pre.user, (error, user) => {
      if (error) {
        reply(Boom.badRequest(error))
        return
      }
      if (!user) {
        reply(Boom.notFound('User id=(' + request.params.id + ') not found!'))
        return
      }
      reply({message: 'User updated!'})
      if (request.params.email) {
        // send verification email to the new email if the email was updated
        var tokenData = {
          username: user.username,
          scope: [user.scope],
          id: user._id
        }
        Common.sentMailVerificationLink(user, createToken(tokenData))
      }
    })
}