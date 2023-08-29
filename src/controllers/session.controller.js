import passport from 'passport'
import { validatePassword } from '../utils/bcrypt.js'
import { getUsers, getUsersByEmail } from '../persistencia/DAOs/mongoDAO/userMongo.js'

// Login controller

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send('error loading user' + error)
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart,
        }
        res.status(200).redirect('/api/products')
    } catch {
        ; (error) => {
            console.error(error)
            res.status(401).send('Error attempting login')
        }
    }
}

// Logout controller

export const logout = async (req, res, next) => {
    try {
        req.session.destroy()
        res.redirect('login')
    } catch {
        ; (error) => console.error(error)
        res.status(500).send('Error attempting logout')
    }
}