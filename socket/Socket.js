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

        socket.on('sendMessage', ({ senderId, receiverId, text, count}) => {
            const user = getUser(receiverId);

            initCount += parseInt(count);
            console.log(initCount);
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            })

            io.to(user.socketId).emit('sendCountNotif', {
                initCount
            })
        })

    })
}

export default Socket;