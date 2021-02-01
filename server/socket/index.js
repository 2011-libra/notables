module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`${socket.id} as disconnected.`)
    })
  })
}
