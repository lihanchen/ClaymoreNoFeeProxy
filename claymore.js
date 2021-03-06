var myArgs = process.argv.slice(2);

if (myArgs.length!=5) {
	console.log("Usage:nodejs claymore.js [listening address] [listening port] [pool address] [pool port] [your ETH address]");
	console.log("Example: nodejs claymore.js 0.0.0.0 8503 us2.ethermine.org 4444 0xB8B74585E5C2B42B013BF3de044a422D8919f516");
	process.exit();
}

local_host = myArgs[0];
local_port = parseInt(myArgs[1]);
remote_host = myArgs[2];
remote_port = parseInt(myArgs[3]);
wallet = myArgs[4];
sockets = new Map();

// The name of the worker for redirected hashpower
// Start with "." for ethermine.org and most pools.
// Start with "/" for ['nanopool.org','dwarfpool.com']
worker_name = '.rekt';

console.log("Wallet set: " + wallet + worker_name);

// Listening
const net = require('net');
const server = net.createServer();

server.on('error', (e) => {
	if (e.code === 'EADDRINUSE') {
		console.log('Address in use. Exit');
	} else {
		console.log(e);
	}
	process.exit();
});

server.on('connection', function(socketClient) {
    console.info('+ Connection from ' + getSignature(socketClient));

	(function(socketClient){
		var socket = new net.Socket();

	    socket.on("connect",function(){
	    	console.log('  Successfully connected Pool');
		})
		socket.on("data",function(data){
	    	socketClient.write(data);
		})
	    socket.on("error",function(err){
	    	sockets.delete(getSignature(socketClient));
	    	console.error('! Failed connecting Pool !!!');
	    	console.error(err);
	    	socketClient.end();
		})

		socket.connect(remote_port, remote_host);
		sockets.set(getSignature(socketClient), socket);
	})(socketClient);


	socketClient.on('data', function(data) {
                if (sockets.get(getSignature(this))==undefined)
                    this.end();
                else
                    sockets.get(getSignature(this)).write(processAddress(data));
	    // socket.write('aaa'+a); //handle(data)
	})

	socketClient.on('close', function() {
                if (sockets.get(getSignature(this))!=undefined)
                    sockets.get(getSignature(this)).end();
		sockets.delete(getSignature(this));
	    console.log('- Client ' + getSignature(this) + ' disconnected.');
	})

	socketClient.on("error",function(err){
    	console.error(err);
	})
})

server.listen(local_port,local_host,() => {
  console.log('Server running on', server.address());
})

var getSignature=function(socket){
	return socket.remoteAddress + ':' + socket.remotePort;
}

var processAddress=function(input){
	var request=input.toString();
	if (request.indexOf('ogin')==-1 || request.indexOf(wallet)!=-1) return input;
	console.log('* DevFee got Rekt !!! Hahaha');
        //console.log('before: '+request);
	request=request.replace(/0x[A-Za-z0-9\.\/]+/, wallet+'.rekt');
        //console.log('after:  '+request);
	return request;
}
