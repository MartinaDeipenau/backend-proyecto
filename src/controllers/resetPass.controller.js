import 'dotenv/config'
import { transporter } from '../utils/nodemailer.js'
import { generateToken } from '../utils/JWTtoken.js'
import { userModel } from '../persistencia/mongoDB/models/user.js'
import { changePassword } from '../persistencia/DAOs/mongoDAO/registerMongo.js'
import jwt from 'jsonwebtoken'

export const generatelink = async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    const token = generateToken(user)
    const sendLink = `http://localhost:4000/api/resetPass/newPassword/${token}`

    try {
        if (!user) {
            res.json({ message: `Usuario con correo electrónico : ${email} no encontrado` })
        } else {
            await transporter.sendMail({
                to: email,
                subject: `Solicitud de cambio de contraseña`,
                text: `Hola, ${user.first_name} por favor siga el enlace para cambiar la contraseña : ${sendLink}`,
            })
            res.status(200).send('Correo enviado exitosamente')
        }
    } catch (error) {
        res.status(500).send('Error al recuperar usuario')
    }
}

export const newPass = async (req, res) => {
    const { pass } = req.body
    const { token } = req.params

    try {
        const isValidToken = jwt.verify(token, process.env.JWT_SECRET)
        if (isValidToken) {
            console.log(isValidToken.user)

            const userEmail = { email: isValidToken.user.email }
            const newPass = {
                password: pass,
            }
            const user = await changePassword(userEmail, newPass)
            console.log(user)

            res.status(200).json({ Message: 'Nueva contraseña cambiada' })
        } else console.log('Algo anda mal')
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}