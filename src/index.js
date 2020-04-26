const { app } = require('./server');
const port = process.env.PORT || 8080;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('New incoming msg:', msg);
        io.emit('new chat message', msg);
    });
});

http.listen(port, () =>
    console.log(`Teachingo API service running on ${port}`)
);
