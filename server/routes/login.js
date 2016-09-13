const Boom = require('boom')

module.exports = [
  {
    method: 'GET',
    path: '/auth/twitter',
    config: {
      auth: 'twitter', // <-- use our twitter strategy and let bell take over
    },
    handler: function (request, reply) {
      if (!request.auth.isAuthenticated || request.query.denied) {
        return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message))
      }
      // Just store a part of the twitter profile information in the session as an example. You could do something
      // more useful here - like loading or setting up an account (social signup).
      const profile = request.auth.credentials.profile
      request.cookieAuth.set({
        twitterId: profile.id,
        username: profile.username,
        displayName: profile.displayName
      })
      return reply.redirect('/t')
    }
  },
  {
    method: ['GET'],
    path: '/auth/linkedin',
    config: {
      auth: 'linkedin', // <-- use our linkedin strategy and let bell take over
    },
    handler: function (request, reply) {
      if (!request.auth.isAuthenticated || request.query.denied) {
        return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message))
      }
      // Just store a part of the twitter profile information in the session as an example. You could do something
      // more useful here - like loading or setting up an account (social signup).
      const profile = request.auth.credentials.profile
      request.cookieAuth.set({
        linkedinId: profile.id,
        firstname: profile.name.first,
        lastname: profile.name.last,
        email: profile.email,
        headline: profile.headline
      })
      return reply.redirect('/l')
    }
  },
  {
    method: 'GET',
    path: '/l',
    config: {
      auth: 'session', // <-- require a session for this, so we have access to the linkedin profile
    },
    handler: function (request, reply) {
      // Return a message using the information from the session
      return reply('Hello, ' + request.auth.credentials.firstname
        + request.auth.credentials.lastname
        + '<br> with email:' + request.auth.credentials.email
        + '<br> with headline:' + request.auth.credentials.headline
        + '<br> with linkedinId:' + request.auth.credentials.linkedinId
        + '!'
        + '<br> <a href="logout">Logout</a>'
      )
    }
  },
  {
    method: 'GET',
    path: '/t',
    config: {
      auth: 'session', // <-- require a session for this, so we have access to the linkedin profile
    },
    handler: function (request, reply) {
      // Return a message using the information from the session
      return reply('Hello, ' + request.auth.credentials.username
        + '<br> with displayName:' + request.auth.credentials.displayName
        + '<br> with twitterId:' + request.auth.credentials.twitterId
        + '!'
        + '<br> <a href="logout">Logout</a>'
      )
    }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {},
    handler: function (request, reply) {
      request.cookieAuth.clear()
      reply.redirect('/login')
    }
  },
  {
    method: 'GET',
    path: '/login',
    config: {},
    handler: function (request, reply) {
      reply.view('login.html')
    }
  }

]
