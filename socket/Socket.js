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

        socket.on('sendMessage', ({ senderId, receiverId, text}) => {
            const user = getUser(receiverId);

            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            })
        })

    })
}

export default Socket;