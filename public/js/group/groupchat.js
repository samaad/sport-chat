$(document).ready(function(){
  const socket = io();

  socket.on('connect', () =>{
    console.log("aah user connected");
  })
});