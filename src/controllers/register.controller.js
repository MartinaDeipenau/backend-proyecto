import { createUser } from '../persistencia/DAOs/mongoDAO/registerMongo.js'
import { userModel } from '../persistencia/mongoDB/models/user.js'
import { transporter } from '../utils/nodemailer.js'


export const newUser = async (req, res) => {
    const { email } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (user) {
            res.json({ menssage: 'User already registered' })
        } else {
            await createUser(req.body)
            await transporter.sendMail({
                to: email,
                subject: `Welcome  ${user.first_name}`,
                text: `User  create successfully `,
            })
            res.status(200).redirect('session/login')
        }
    } catch (error) {
        res.status(500).send('Error in session registering')
    }
}