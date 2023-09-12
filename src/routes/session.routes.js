import { Router } from 'express'
import { login, logout, current } from '../controllers/session.controller.js'
import passport from 'passport'


const sessionRouter = Router()

// Login

sessionRouter.get('/login', async (req, res) => {
    res.render('login')
})

sessionRouter.post('/login',
    passport.authenticate('login', {
        passReqToCallback: true,
        failureMessage: 'Algo salió mal',
        failureRedirect: '/api/errorAttemptingToLogin',
    }),
    login
)


// Logout

sessionRouter.get('/logout', logout)

sessionRouter.get('/current', current)
export default sessionRouter