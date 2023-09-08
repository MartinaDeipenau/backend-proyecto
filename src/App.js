import 'dotenv/config'
import express from 'express'
import './config/configDB.js'
import 'dotenv/config' // Para poder implementar dotenv
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'

import productsRouters from './routes/product.routes.js'
import cartsRouters from './routes/carts.routes.js'
import messagesRouters from './routes/messages.routes.js'
import sessionRouters from './routes/session.routes.js'
import registerRouter from './routes/register.routes.js'
import loggerRoutes from './routes/loggerTest.routes.js'
import resetPasswordsRouter from './routes/resetPassword.routes.js'
import userRouter from './routes/user.routes.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import * as path from 'path'
import { __dirname, __filename } from './utils/path.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './config/passportStrategies.js'
import errorHandler from '../src/middleware/errors.js'

import { loggerDev } from './utils/loggerWinston.js'

import { loggerMiddleware } from './middleware/logger.js'



// Configuration express

const app = express()
const PORT = 4000

// Configuration swagger

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce APIs documentation',
            description: 'Info product and cart',
            version: '1.0.0',
            contact: {
                name: 'Deipenau Martina Lourdes',
                url: 'https://www.linkedin.com/in/martina-lourdes-deipenau',
                email: 'martinadeipenau02@gmail.com'
            },
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
}
const spec = swaggerJSDoc(swaggerOptions)

// Configuration cookies

app.use(cookieParser(process.env.SIGNED_COOKIES))

// Configuration session

app.use(
    session({ // Session en mongo atlas
        store: MongoStore.create({
            mongoUrl: process.env.URL_MONGOOSE,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 210 // Segundos
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false, // Evita guardar sesiones vacías
    }))

// Configuration passport

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Configuration handlebars

app.engine('handlebars', engine()) // Voy a trabajar con handlebars
app.set('view engine', 'handlebars') // Mis vistas son tipo handlebars
app.set('views', path.resolve(__dirname, './views'))

// Middleware

app.use(express.json()) // Me permite ejecutar json en la app
app.use(express.urlencoded({ extended: true })) // Me permite poder realizar consultas en (req.query)
app.use(loggerMiddleware)

app.get('/', (req, res) => {
    res.render('home', { title: 'Pagina de inicio' })
})

const myServer = app.listen(PORT, () => {
    loggerDev.info(`Server on port ${PORT}`)
})

// Server Io

const io = new Server(myServer)

app.use((req, res, next) => {
    req.io = io
    return next()
})

// Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', productsRouters)
app.use('/api/carts', cartsRouters)
app.use('/api/messages', messagesRouters)
app.use('/api/session', sessionRouters)
app.use('/api/register', registerRouter)
app.use('/api/loggerTest', loggerRoutes)
app.use('/api/resetPass', resetPasswordsRouter)
app.use('/api/user', userRouter)
// Ruta para documentación de API usando Swagger
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))


// Custom error handler
app.use(errorHandler)