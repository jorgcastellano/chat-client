// const baseUrl = "http://localhost:3000";
const baseUrl = "https://chat-dev.digilabel.app";
const userId1 = '8cea7f38b53047dc93fff627b59d95c0';
const userId2 = '212dbf1049f248aabd00cd3c934b327f';
var roomId = '';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMTJkYmYxMDQ5ZjI0OGFhYmQwMGNkM2M5MzRiMzI3ZiIsInVzZXJUeXBlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNjY1NDYyMzg3fQ.h8KzuFLCtohY4T2tV8jQKMx-wMbZkfTv9g1t72Rgjj4';

var socket = io(baseUrl);

let email = prompt("Ingrese su correo", "");

console.log(email);
if ( email != '') {

    socket.on("connect", () => {
        console.log(`Connected to: ${socket.id}`);
    });

    let _datos = {
        userIds: [userId1, userId2],
        type: "consumer-to-professional"
    }

    var form = document.getElementById('form');
    var input = document.getElementById('input');

    fetch(`${baseUrl}/room/initiate`, {
        method: "POST",
        body: JSON.stringify(_datos),
        headers: { "Content-type": "application/json; charset=UTF-8", 'Authorization': 'Bearer ' + token }
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            roomId = data.chatRoom.chatRoomId;

            fetch(`${baseUrl}/room/${roomId}`, {
                headers: { "Content-type": "application/json; charset=UTF-8", 'Authorization': 'Bearer ' + token }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    data.conversation.forEach(function (msg) {
                        var item = document.createElement('li');
                        item.textContent = msg.message.messageText;
                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    });
                })
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));

    // socket.emit("identity", userId);
    // socket.emit("subscribe", roomId, userId);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            //socket.emit("send message", roomId, input.value);
            //Enviar mensaje
            fetch(`${baseUrl}/room/${roomId}/message`, {
                method: "POST",
                body: JSON.stringify({ messageText: input.value }),
                headers: { "Content-type": "application/json; charset=UTF-8", 'Authorization': 'Bearer ' + token }
            })
                .catch(err => console.log(err));
            var mymsg = document.createElement('li');
            mymsg.textContent = input.value;
            messages.appendChild(mymsg);

            window.scrollTo(0, document.body.scrollHeight);
            input.value = '';
        }
    });

    socket.on('new message', function (msg) {
        console.log("new message event");
        console.log(msg);
        var item = document.createElement('li');
        item.textContent = msg.message;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}
