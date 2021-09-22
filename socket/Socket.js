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

        socket.on('sendMessage', ({ messageId, senderId, receiverId, text, count, interactif, etatInteractif, conversationId}) => {
            const user = getUser(receiverId);
            const sender = getUser(senderId);
            // console.log(senderId, receiverId, text, count);
            initCount += parseInt(count);

            if (user?.socketId) {
                io.to(user.socketId).emit("getMessage", {
                    messageId,
                    senderId,
                    text,
                    interactif,
                    etatInteractif,
                    conversationId,
                })

                io.to(user.socketId).emit('sendCountNotif', {
                    initCount
                })

                // io.to(sender.socketId).to(user.socketId).emit('getEditOneMessage', {
                //     messageId,
                //     etatInteractif,
                //     conversationId
                // })
            }
        });

        socket.on('editOneMessage', ({messageId, receiverId, senderId, etatInteractif, conversationId}) => {
            const receiver = getUser(receiverId);
            const sender = getUser(senderId);
            // console.log("receiver", receiver);
            // console.log("sender", sender);
            if(receiver?.socketId && sender?.socketId){
                io.to(sender.socketId).to(receiver.socketId).emit('getEditOneMessage', {
                    messageId,
                    etatInteractif,
                    conversationId
                })
            }
        })

    })
}

export default Socket;