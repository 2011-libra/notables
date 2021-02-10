module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection has been made: ${socket.id}`)

    socket.on('update-document', async (message)=>{
      const {docToken, content} = message;
      console.log('Socket Received a new Message:', message)
      // ASYNC PUT request to database goes here
      let updatedDocument = 'Response from PUT update goes here';

      // Broadcast Response to all participants connected to the token ID path
      socket.broadcast(docToken, updatedDocument);
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} as disconnected.`)
    })
  })
}
