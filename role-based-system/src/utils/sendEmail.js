const nodemailer = require('nodemailer');

const sendEmail = async (email, password, role) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sq.ravi777@gmail.com",
                pass: "wavtbozmmjpmqohh"
            }
        });

        const mailOptions = {
            from: "sq.ravi777@gmail.com",
            to: email,
            subject: `Your ${role} Account Credentials`,
            text: `Welcome to the system!\n\nYour account has been created as a ${role}.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password for security.\n\nRegards,\nAdmin Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
