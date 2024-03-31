const http= require( "http")
const express= require( "express" );
const cors=require( "cors" );
const socketIo=require( "socket.io" );

const app = express();
const server=http.createServer(app);
const io=socketIo(server);
const port= process.env.PORT;

const users=[];

app.use(cors());

app.get("/", (req, res)=>{
        res.send("ITS Working")
})
io.on("connection", (socket) => {
    

    socket.on("joined", ({user}) =>{
        console.log(users);
        users[socket.id] = user;
        // console.log(users)
        console.log(`user : ${user}`);
        socket.emit("welcome", {user: "Admin", message:`${users[socket.id]}, Welcome to Vikas Chat`});
        socket.broadcast.emit("userJoined", {user: "Admin", message:`${users[socket.id]} has joined`});
       
    });
    socket.on('disconnected',()=>{
        socket.broadcast.emit("leave", {user: "Admin", message:`${users[socket.id]} has left`});
        console.log(`${users[socket.id]} socket disconnected `);
    })
    socket.on("message", ({message, id})=>{
        console.log(message, id);
       io.emit("sendMessage",{user: users[id],message: message ,id: id});
    });
});


server.listen(port, ()=>{
        console.log("server listening on port: " + port);
});