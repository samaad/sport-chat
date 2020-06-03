$(document).ready(function(){
  const socket = io();

  socket.on('connect', () =>{
    console.log("aah user connected");
  })

  $('#message-form').on('submit', function(e){
    e.preventDefault();
    
    var msg = $('#msg').val();

    socket.emit('createMessage',{
      text: msg,
    },function(){
      $('#msg').val(' ');
    })


  });
});