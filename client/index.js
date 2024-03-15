import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')

const getUsername = async () => {
  const username = window.localStorage.getItem('username')
  if (username) {
    console.log(`User existed ${username}`)
    return username // Asegúrate de retornar el nombre de usuario si ya existe.
  }

  const res = await fetch('https://random-data-api.com/api/users/random_user')
  const { username: randomUsername } = await res.json()

  window.localStorage.setItem('username', randomUsername)
  return randomUsername
};

(async () => { // IIFE asíncrona para permitir el uso de await
  const username = await getUsername()

  const socket = io({
    auth: {
      username,
      serverOffset: 0
    }
  })

  socket.on('chat message', (msg, serverOffset, username) => {
    const item = `
    <li>
      <p>${msg}</p>
      <small>${username}</small>
    </li>
    `
    messages.insertAdjacentHTML('beforeend', item)
    socket.auth.serverOffset = serverOffset

    // scroll to bottom of messages
    messages.scrollTop = messages.scrollHeight
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (input.value) {
      socket.emit('chat message', input.value)
      input.value = ''
    }
  })
})()
