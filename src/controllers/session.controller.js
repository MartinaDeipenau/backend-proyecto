import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/JWTtoken.js'
import currentUser from '../dto/currentUser.js'
import { error } from 'winston'

// Login controller

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send('Error user' + error)
        const user = new currentUser(req.user)
        const token = generateToken(user)
        res.cookie('myCookie', token, { maxAge: 2500000, httpOnly: true }).redirect('/api/products')
    } catch (error) {
        console.error(error)
        res.status(401).send('Error login')
    }
}

// Logout controller

export const logout = async (req, res, next) => {
    try {
        req.session.destroy()
        res.redirect('login')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error attempting logout')
    }
}