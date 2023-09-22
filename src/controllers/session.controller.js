import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/JWTtoken.js'
import currentUser from '../dto/currentUser.js'
import { updateLastConnection } from '../persistencia/DAOs/mongoDAO/userMongo.js'

// Login controller

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send('Error al cargar usuario' + error)
        const user = new currentUser(req.user)
        req.session.user = user
        const token = generateToken(user)
        res.cookie('myCookie', token, { maxAge: 3600000, httpOnly: true }).redirect('/api/products')
    } catch (error) {
        console.error(error)
        res.status(401).send('Error al intentar iniciar sesión')
    }
}

// Logout controller

export const logout = async (req, res, next) => {
    try {
        req.session.destroy()
        await updateLastConnection(req.user._id);
        res.redirect('login')
    } catch (error) {
        console.error(error)
        res.status(500).redirect('/api/errors/errorslog')
    }
}

export const current = async (req, res) => {
    try {
        const cookie = req.cookies['myCookie']
        const user = jwt.verify(cookie, process.env.JWT_SECRET)
        if (user)
            return res.send({ status: "success", payload: user })
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: "error", message: "Error obteniendo current user" })
    }
}