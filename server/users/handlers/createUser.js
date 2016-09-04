'use strict'

const Boom        = require('boom')
const User        = require('../models/User')
const Common      = require('../util/common')
const createToken = require('../util/userFunctions').createToken

// had some errors with bcrypt on windows
// function hashPassword(password, cb){
//   // Generate a salt at level 10 strength
//   bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (error, hash) => {
//       return cb(error, hash)
//     })
//   })
// }

module.exports = function (request, reply) {
  let user = new User()
  user.email = request.payload.email
  user.username = request.payload.username
  user.scope = 'User'
  user.password = Common.encrypt(request.payload.password)
  // hashPassword(req.payload.password, (error, hash) => {
  // if (error){
  //     reply( Boom.badRequest(error))
  //     return
  // }
  // user.password = hash
  user.save((error, user) => {
    if (!error) {
      var tokenData = {
        username: user.username,
        scope: [user.scope],
        id: user._id
      }
      Common.sentMailVerificationLink(user, createToken(tokenData), (error) => {
        if (error) {
          reply(Boom.serverUnavailable('Try again in a few Hours'))
          return
        }
        reply({message: 'Please confirm your email id by clicking on link in email'})
      })
    }else {
      if (11000 === error.code || 11001 === error.code) {
        reply(Boom.forbidden('please provide another user email'))
      } else {
        console.log(error)
        reply(Boom.forbidden(error)) // HTTP 403 //why?
      }
    }
  })
  // })
}