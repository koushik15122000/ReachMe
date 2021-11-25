const io = require('socket.io')(8900,{
    cors:{
        origin:"http://localhost:3000",
    }
});

let users = [];

const addUser = (userId,socketId) =>{
    !users.find((user)=>user.userId === userId) && users.push({userId,socketId});
} 

const removeUser = (socketId) => {
    users=users.filter(user=>user.socketId!==socketId)
}

const getUser = (userId) => {
    return users.find(user=>user.userId==userId);
}

io.on("connection",(socket)=>{
    //when connect
    console.log("a user connected");
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users);
    })

    //send and get message
    socket.on("sendMessage",({senderId,recieverId,text})=>{
        const reciever = getUser(recieverId);
        io.to(reciever.socketId).emit("getMessage",{
            senderId,
            text,
        })
    })

    //when disconnect
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
})