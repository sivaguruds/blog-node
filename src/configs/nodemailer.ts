import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEJS_GMAIL_APP_USER,
        pass: process.env.NODEJS_GMAIL_APP_PASSWORD,
    },
})

export default transport
