const base = require('./base')
const api = require('./api')
const users = require('./users')
// const admin = require('./admin.js')
// const login = require('./login.js')
// const rest = require('./rest.js')

module.exports = [].concat(base,
                           api,
                           users
                        // admin,
                        // login,
                        // rest
                           )
