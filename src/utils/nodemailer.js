import 'dotenv/config'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.NODEMAILER_CREDENTIAL,
        pass: process.env.NODEMAILER_PASS,
    },
})