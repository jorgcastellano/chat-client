const baseUrl = "http://localhost:3000";
const userId = '7019f869b10b4db3ace7d6dfbfd44987';
const roomId = '04f77704ee6945b4973883fc8b7491cb';

var socket = io(baseUrl);

socket.on("connection", () => {
    console.log(`Connected to: ${socket.id}`);
});

socket.emit("identity", userId);
socket.emit("subscribe", roomId, userId);

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("send message", roomId, input.value);
        input.value = '';
    }
});

socket.on('new message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg.message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
