import NetcatServer from 'netcat/server.js';
var serverm = new NetcatServer();

serverm.on('ready', function() {
    console.log('Server ready on port 5000');
});

serverm.on('data', function(client, data) {
    console.log('Data from client:', data.toString());
    // Cman send a response back to the client here if needed
});

serverm.port(5000).listen();
