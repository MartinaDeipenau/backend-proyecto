import { Router } from "express";

const errorsRouter = Router()

errorsRouter.get('/errorslog', (req, res) => {
    res.render('errorLogin_logout_NewPass')
})

export default errorsRouter