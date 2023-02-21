const express = require('express');
const app = express();
const { Server } = require('socket.io');
const server = require('http').createServer(app);
const io = new Server(server);

const port = 3000;
server.listen(process.env.PORT || port);
console.log(`server running on port ${port}`);

app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

//configure view engine
app.set('view engine', 'pug');

//routing
app.get('/', (req, res) => {
    res.locals = {title: 'Chat application', h1: 'Socket.io chat app', h3: 'Live chats'};
    res.render('index');
});


//initiate socket connection
io.on('connection', (socket) => {
    console.log('A user has joined the chat room');

    //event chat from client
    socket.on('new chat', (message) => {
        io.emit('received chat', message);
    });

    //socket disconnect
    socket.on('disconnect', () => {
        console.log('A user has left the chat room');
    });
});