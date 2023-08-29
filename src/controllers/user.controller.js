import { userModel } from '../persistencia/mongoDB/models/user.js'
import { changeRole } from '../persistencia/DAOs/mongoDAO/userMongo.js'

export const changeUserRole = async (req, res) => {
    const { uid } = req.params
    try {
        const user = await userModel.dinfById(uid)
        user.role = user.role === 'user' ? 'premium' : 'user'
        await user.save()

        res.status(200).send(user)
    } catch (error) {
        console.log(error)
    }
}