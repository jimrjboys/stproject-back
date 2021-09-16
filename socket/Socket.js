let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId });

    console.table(users);
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
    console.table(users);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

let initCount = 0;

const Socket = (io) => {
    io.on('connection', socket => {
        console.log("client connecté")
        socket.on("addUser", userId => {
            addUser(userId, socket.id);
        })

        socket.on('disconnect', () => {
            console.log("user disconnected");
            removeUser(socket.id)
        })

        socket.on('removeUser', () => {
            removeUser(socket.id)
        })

        socket.on('sendMessage', ({ senderId, receiverId, text, count, interactif, etatInteractif, conversationId}) => {
            const user = getUser(receiverId);
            // console.log(senderId, receiverId, text, count);
            initCount += parseInt(count);

            if (user?.socketId) {
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    text,
                    interactif,
                    etatInteractif,
                    conversationId,
                })

                io.to(user.socketId).emit('sendCountNotif', {
                    initCount
                })
            }
        });

        socket.on('editOneMessage', ({createdAt, receiverId, senderId, etatInteractif, convId}) => {
            const receiver = getUser(receiverId);
            const sender = getUser(senderId);

            if(receiver?.socketId && sender?.socketId){
                io.to(receiver.socketId).to(sender.socketId).emit('getEditOneMessage', {
                    createdAt,
                    etatInteractif,
                    convId
                })
            }
        })

    })
}

export default Socket;