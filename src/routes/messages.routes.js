import { Router } from 'express'
import { messagesModel } from '../persistencia/mongoDB/models/messages.js'
import { auth } from '../middleware/auth.js'

const messagesRouters = Router()

messagesRouters.get('/', async (req, res) => {
  //auth(['user, premium, admin']),
  try {
    req.io.on('connection', async (socket) => {
      console.log('Client connected')
      socket.on('message', async (data) => {
        await messagesModel.create(data)
        req.io.emit('messages', await messagesModel.find())
      })
    })

    res.render('messages')
  } catch (error) {
    console.log(error)
    res.status(500).send('Error al recibir mensajes')
  }
})

export default messagesRouters