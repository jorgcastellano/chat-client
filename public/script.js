//const baseUrl = "http://localhost:3000";
const baseUrl = "https://chat-dev.digilabel.app";
var roomId = '';
var token = '';
var socket = io(baseUrl);
let email = prompt("Ingrese su correo", "");

console.log(email);
if (email != '') {

    socket.on("connect", () => {
        console.log(`Connected to: ${socket.id}`);
    });

    fetch(`${baseUrl}/login/${email}`, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(r => r.json().then(data => ({
            status: r.status, body: data
        })))
        .then((data) => {
            if (data.status == 200) {
                token = data.body.authorization;
                let email2 = prompt("Correo para hablar", "");
                console.log(email2);
                let _datos = {
                    userIds: [email, email2],
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

                        socket.emit("identity", email);
                        socket.emit("subscribe", roomId, email);

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
            }
        })
        .catch(err => console.log(err));

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
