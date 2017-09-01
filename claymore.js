var myArgs = process.argv.slice(2);

if (myArgs.length!=5) {
	console.log("Usage: ./proxy.py [localhost] [localport] [remotehost] [remoteport] [ETH Wallet]")
	console.log("Example: ./proxy.py 127.0.0.1 9000 eth.realpool.org 9000 0x...")
	process.exit()
}

local_host = myArgs[0]
local_port = parseInt(myArgs[1])
remote_host = myArgs[2]
remote_port = parseInt(myArgs[3])
wallet = myArgs[4]

// The name of the worker for redirected hashpower
// Use / for ['nanopool.org','dwarfpool.com']
worker_name = '.rekt'

console.log("Wallet set: " + wallet + worker_name)

// Listening
const net = require('net')
const server = net.createServer()

server.on('error', (e) => {
	if (e.code === 'EADDRINUSE') {
		console.log('Address in use. Exit')
	} else {
		console.log(e)
	}
	process.exit()
});

server.on('connection', function(socket) {
    var client = socket.remoteAddress + ':' + socket.remotePort;
    console.info('Connected to ' + client)
	
	setTimeout(function() {socket.write('timeout')
}, 10000)

    socket.on('data', function(data) {
        socket.write('aaa'+data) //handle(data)
    })

    socket.on('end', function() {
		var client = socket.remoteAddress + ':' + socket.remotePort
        console.log('Client ' + client + ' disconnected.')
    })
})

server.listen(local_port,local_host,() => {
  console.log('opened server on', server.address())
})