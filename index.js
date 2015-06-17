var Hapi = require('hapi');
var server = new Hapi.Server();
var config = require('./config');
process.env.slackToken = config.slackToken;


server.connection({ port: config.port });

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.route(require('slack-webhook-jseval'));