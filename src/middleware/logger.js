import 'dotenv/config'
import { loggerDev, loggerProduction } from '../utils/loggerWinston.js'


export const loggerMiddleware = (req, res, next) => {
    if (process.env.LOGGER_ENV !== 'production') {
        req.logger = loggerDev
    } else {
        req.logger = loggerProduction
    } 
    next()
}