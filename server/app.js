import express from 'express'
import {Server} from "socket.io"; 
import {createServer} from 'http';
import cors from 'cors';

// const cors = require("cors");
const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
}));

app.get("/", (req, res) =>{
    res.send("hello server!")
});

io.on("connection", (socket) =>{

    console.log("user connected", socket.id);

    socket.on("message", ({room, message})=>{
      console.log({room, message});
      io.to(room).emit("received-message", message);
    });

    // socket.on("join-room",(room) => {
    //   socket.join(room);
    //   console.log(`user joined room ${room}`)
    // });

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`User joined room ${room}`);
    });

    socket.on("disconnect", ()=>{
      console.log("User Disconnected", socket.id);
    });
   
});

server.listen(port, ()=> {
    console.log(`app is running on port ${port}`)
});