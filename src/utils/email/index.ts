import transport from '../../configs/nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const RegisterSucessEmail = (email: string, name: string) => {
  transport.sendMail({
    from: process.env.NODEJS_GMAIL_APP_USER,
    to: email,
    subject: 'Register Success',
    html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for register.</p>
            </div>`,
  });
};

export const forgotPasswordEmail = (email: string, name: string, link: string) => {
  transport.sendMail({
    from: process.env.NODEJS_GMAIL_APP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<h1>Hello ${name}</h1>
            <p>You requested to reset your password</p>
            <a href=${link}>Reset password</a>
            </div>`,
  });
};
