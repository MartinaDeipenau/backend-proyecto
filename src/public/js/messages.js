const socket = io()

let user
let chatButton = document.getElementById('chatButton')
let chatBox = document.getElementById('chatBox')
let messagesP = document.getElementById('messagesP')
let chatStart = document.getElementById('startChat')

function renderMessages() {
  socket.on('messages', (dataMessage) => {
    messagesP.innerHTML = ''
    dataMessage.forEach((message) => {
      messagesP.innerHTML += `<p>${message.user} : ${message.message}<p>`
    })
  })
}
if (chatStart) {
  chatS.addEventListener('click', () => {
    Swal.fire({
      title: 'Identificación',
      input: 'Texto',
      text: 'Agregar nombre de usuario',
      inputValidator: (value) => {
        return !value && 'Se requiere nombre de usuario'
      },
      allowOutsideClick: false,
    }).then((result) => {
      user = result.value
    })
  })
}


if (chatButton) {
  chatButton.addEventListener('click', () => {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', { user: user, message: chatBox.value })
      chatBox.value = ''
    }
  })
}

renderMessages()