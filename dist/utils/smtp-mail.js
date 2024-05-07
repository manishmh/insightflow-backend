"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpMailing = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const smtpMailing = async (to, subject, code) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'smtpmailing.manishmh@gmail.com',
            pass: 'oton vjox cpoq ytzr'
        }
    });
    const mailOptions = {
        from: "smtpmailing.manishmh@gmail.com",
        to,
        subject,
        text: `your 2 factor authentication code is ${code}`
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    }
    catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
exports.smtpMailing = smtpMailing;
