const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth:{
        user: "sq.ravi777@gmail.com",
        pass: "wavtbozmmjpmqohh"
    }
})


const sendEmail = async (message) => {
    let response = await transporter.sendMail(message)
    console.log(response);
}

module.exports = sendEmail;