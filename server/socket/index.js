module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection has been made: ${socket.id}`)

    socket.on('update-document', async (message)=>{
      let {token, contents} = message;
      console.log('Socket Received a new Message:', message)
      // ASYNC PUT request to database goes here
      let updatedDocument = {contents: `Updated Version: ${contents}\n extra text here`};
      // Broadcast Response to all participants connected to the token ID path
      socket.emit(`${token}`, updatedDocument);
      socket.broadcast.emit(`${token}`, updatedDocument);
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} as disconnected.`)
    })
  })
}
