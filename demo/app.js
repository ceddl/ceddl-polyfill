var static = require('node-static');

var fileServer = new static.Server('./demo');
var distServer = new static.Server('./dist');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        if(request.url.includes('index.js')) {
            distServer.serve(request, response);
        } else {
            fileServer.serve(request, response);
        }
    }).resume();
}).listen(8080);

console.log('Navigate to http://localhost:8080/');
