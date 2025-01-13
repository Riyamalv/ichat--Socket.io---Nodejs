import React, {useEffect, useState, useMemo} from "react";
import {io} from 'socket.io-client'
import {Button, Container, TextField, Typography, Box, Stack} from "@mui/material"

const App = () => {

  const socket = useMemo(() => io("http://localhost:3000/"), []);
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");


  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
   

  }

  const joinRoomHandler =(e)=>{
    e.preventDefault();
    socket.emit('join-room', roomName)
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () =>{
      setSocketId(socket.id);
      console.log("connected", socket.id);
      
    })

    socket.on("received-message", (data)=>{
      console.log(data);
      setMessages((messages) =>[...messages, data]);
    })

    socket.on("welcome", (s)=>{
      console.log(s)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return  (
    <Container maxWidth = "sm">
      <Box sx= {{height:100} }/>
      <Typography variant= 'h1' component="div" gutterBottom>
        Welcome to iChat
      </Typography>

      <Typography variant= 'h5' component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
      <TextField value={roomName} onChange = {(e) => setRoomName(e.target.value)} id="outlined-basic" label="Room Name" variant="outlined" />
      <Button type="submit" variant="contained">Join Room</Button>

      </form>

      <form onSubmit={handleSubmit}>
      <TextField value={message} onChange = {(e) => setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />

      <TextField value={room} onChange = {(e) => setRoom(e.target.value)} id="outlined-basic" label="Room" variant="outlined" />

      <Button type="submit" variant="contained">Send</Button>
      </form>

      { <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack> }
    </Container>
  )
  
};

export default App;
