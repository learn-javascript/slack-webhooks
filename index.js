var Hapi = require('hapi');
var server = new Hapi.Server();
var config = require('./config');
var Sandbox = new (require('sandbox'));




server.connection({ port: config.port });

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'POST',
    path: '/slack/outgoing/eval-js',
    handler: function (request, reply) {
        if(request.payload.token !== config.slackWebhookToken) return reply('Incorrect token').code(401);
        var code = request.payload.text.slice(3).trim();
        Sandbox.run(code, function(out){
            var response = '';
            if( (!out.result || out.result === 'null') && out.console.length === 0 ) return reply('Snippet ran sucessfully.');
            if(out.console.length > 0){
                response += out.console.reduce(function(s, c){
                    return s + c.replace('\n', ' ');
                }, '');
                return reply({text : response});
            }
            response = out.result.split('\n').slice(0,3).join('\n');
            reply({text : response});
        });
    }
});
