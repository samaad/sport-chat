module.exports = function(io){

  io.on('connection', (socket) =>{
    console.log('User Connected');
    
    
    socket.on('createMessage', (message, callback) => {
      console.log(message);
    });

  });
}