const base = require('./base')
const api = require('./api')
const users = require('./users')
const login = require('./login')
const websockets = require('./websockets.js')
// const admin = require('./admin.js')
// const rest = require('./rest.js')

module.exports = [].concat(base,
                           api,
                           users,
                           login,
                           websockets
                        // admin,
                        // rest
                           )
