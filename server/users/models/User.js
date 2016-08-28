'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const autoIncrement = require('mongoose-auto-increment')
// const db = require('../../config/user-db').db
// autoIncrement.initialize(db)

const userModel = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    enum: ['User', 'Premium', 'Admin'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  jwt: {
    type: String
  }
})

// userModel.plugin(autoIncrement.plugin, {
//     model: 'user',
//     field: '_id'
// })

module.exports = mongoose.model('User', userModel)
