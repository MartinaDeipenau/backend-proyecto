import { Router } from 'express'
import { login, logout } from '../controllers/session.controller.js'
import passport from 'passport'


const sessionRouter = Router()

// Login

sessionRouter.get('/login', async (req, res) => {
    res.render('login')
})

sessionRouter.post('/login',
    passport.authenticate('login', {
        passReqToCallback: true,
        failureRedirect: '/api/errorAttemptingToLogin',
        failureMessage: '...',
    }),
    login
)


// Logout

sessionRouter.get('/logout', logout)

export default sessionRouter