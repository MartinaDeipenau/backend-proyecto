import { createUser } from '../persistencia/DAOs/mongoDAO/registerMongo.js'
import { userModel } from '../persistencia/mongoDB/models/user.js'
import { transporter } from '../utils/nodemailer.js'


export const newUser = async (req, res) => {
    const { first_name, email } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (user) {
            res.json({ message: 'Usuario ya registrado' })
        } else {
            await createUser(req.body)
            await transporter.sendMail({
                to: email,
                subject: `Welcome  ${first_name}`,
                text: `Usuario creado con éxito`,
            })
            res.status(200).redirect('session/login')
        }
    } catch (error) {
        res.status(500).json({ message: error })
        console.error(error)
    }
}