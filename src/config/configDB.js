import 'dotenv/config'
import mongoose from 'mongoose'
import { loggerDev } from '../utils/loggerWinston.js'

// Configuración mongoose
mongoose
    .connect(process.env.URL_MONGOOSE)
    .then(() => loggerDev.info('DB is connected'))
    .catch((error) => loggerDev.fatal(error))