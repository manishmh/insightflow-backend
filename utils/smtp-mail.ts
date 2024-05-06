import nodemailer from 'nodemailer';

export const smtpMailing = async (to: string, subject: string, code: number): Promise<boolean> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smtpmailing.manishmh@gmail.com',
            pass: 'oton vjox cpoq ytzr'
        }
    })
    
    const mailOptions = {
        from: "smtpmailing.manishmh@gmail.com",
        to,
        subject,
        text: `your 2 factor authentication code is ${ code }`
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}