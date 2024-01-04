"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordEmail = exports.RegisterSucessEmail = void 0;
const nodemailer_1 = __importDefault(require("../../configs/nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RegisterSucessEmail = (email, name) => {
    nodemailer_1.default.sendMail({
        from: process.env.NODEJS_GMAIL_APP_USER,
        to: email,
        subject: 'Register Success',
        html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for register.</p>
            </div>`,
    });
};
exports.RegisterSucessEmail = RegisterSucessEmail;
const forgotPasswordEmail = (email, name, link) => {
    nodemailer_1.default.sendMail({
        from: process.env.NODEJS_GMAIL_APP_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `<h1>Hello ${name}</h1>
            <p>You requested to reset your password</p>
            <a href=${link}>Reset password</a>
            </div>`,
    });
};
exports.forgotPasswordEmail = forgotPasswordEmail;
