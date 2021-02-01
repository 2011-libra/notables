import io from 'socket.io-client'

const socket = io(window.location.origin)

socket.on('connection', () => {
  console.log('Socket Connected.')
})

export default socket;
