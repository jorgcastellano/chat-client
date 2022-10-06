// const baseUrl = "http://localhost:3000";
const baseUrl = "https://chat-dev.digilabel.app";
const userId = 'cce24930efda486781ea68b9ff914a47';
const roomId = '04f77704ee6945b4973883fc8b7491cb';

var socket = io(baseUrl);

socket.on("connect", () => {
    console.log(`Connected to: ${socket.id}`);
});

// socket.emit("identity", userId);
// socket.emit("subscribe", roomId, userId);

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("send message", roomId, input.value);
        var mymsg = document.createElement('li');
        mymsg.textContent = input.value;
        messages.appendChild(mymsg);
        window.scrollTo(0, document.body.scrollHeight);
        input.value = '';
    }
});

socket.on('new message', function(msg) {
    console.log("new message event");
    var item = document.createElement('li');
    item.textContent = msg.message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

