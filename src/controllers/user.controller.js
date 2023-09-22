import { userModel } from '../persistencia/mongoDB/models/user.js'
import { getUsers, getUserById, deleteUser, updateActiveUser } from '../persistencia/DAOs/mongoDAO/userMongo.js'
import { transporter } from '../utils/nodemailer.js'


export const changeUserRole = async (req, res) => {
    const { uid } = req.params
    try {
        const user = await userModel.findById(uid)

        if (user.role != 'admin') {
            user.role = user.role === 'user' ? 'premium' : 'user'
            await user.save()

            res.status(200).redirect('/api/admin')
        } else {
            res.status(401).send({ message: "No podes cambiar el rol del administrador" })
        }
    } catch (error) {
        res.status(402).send('Error al cambiar el rol de usuario')
    }
}

export const allUser = async (req, res) => {
    try {
        const users = await getUsers()
        res.render('admin', { users: users })
    } catch (error) {
        res.status(401).send('Error al obtener usuarios')
    }
}

export const deleteOneUser = async (req, res) => {
    const { uid } = req.params
    const user = await getUserById(uid)

    try {

        if (user.role != 'admin') {
            await transporter.sendMail({
                to: user.email,
                subject: `Información importante ${user.first_name}`,
                text: `
          ${user.first_name} Le informamos que por falta de uso su cuenta ha sido eliminada`
            })
            await deleteUser(uid)
            res.status(200).redirect('/api/admin/')
        } else {
            res.status(401).send({ Message: "No se permite eliminar el administrador" })
        }

    } catch (error) {
        res.status(401).send('Error al eliminar usuario')
    }
}

export const updateActiveAllUsers = async (req, res) => {
    try {

        const today = new Date
        const twoDaysAgo = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000))
        const thirtyMinutesAgo = new Date(today.getTime() - (30 * 60 * 1000))

        const filter = { last_connections: { $lt: twoDaysAgo } }
        const update = { $set: { active: false } }

        updateActiveUser(filter, update);
        res.status(200).redirect('/api/admin/')
    } catch (error) {
        res.status(401).send('Error al actualizar usuarios vacíos')
    }
}

export const deleteAllInactiveUsers = async (req, res) => {

    const users = await getUsers()
    try {

        const usersToDelete = users.filter(user => user.active === false && user.role !== 'admin')

        usersToDelete.forEach(async (user) => {
            await deleteUser(user.id)
            await transporter.sendMail({
                to: user.email,
                subject: `Información importante ${user.first_name}`,
                text: `
          ${user.first_name} Le informamos que por falta de uso su cuenta ha sido eliminada`
            })
        })
        res.status(200).redirect('/api/admin/')
    } catch (error) {
        res.status(401).send('Error al eliminar usuarios activos')
    }
}