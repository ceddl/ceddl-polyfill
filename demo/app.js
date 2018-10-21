var static = require('node-static');
var rollup = require('rollup');
var fileServer = new static.Server('./demo');
var distServer = new static.Server('./dist');

var watchOptions = {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'ceddl'
    },
    watch: {
        include: 'src/**'
    }
};
var watcher = rollup.watch(watchOptions);
watcher.on('event', event => {
  console.log('ROLLUP: ' + event.code);
  if (event.code === 'ERROR' || event.code === 'FATAL') {
    console.log(event);
  }
});


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
