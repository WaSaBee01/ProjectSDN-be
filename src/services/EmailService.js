const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
// var inlineBase64 = require("nodemailer-plugin-inline-base64");

const sendEmailCreateOrder = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });
    let listItems = '';
    const attachImage = [];
    orderItems.forEach((order) => {
        listItems += `<div>

        <div>Bạn đã đặt <b>${order.name}</b> với số lượng: <b>${order.amount}</b> - giá <b>${order.price}</b> VND </div>
        
        </div>`
        attachImage.push({ path: order.image })
    })
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: "Bạn đã đặt hàng tại EStore", // Subject line
        text: "Order created successfully", // plain text body
        html: `<div><p>Bạn đã đặt hàng thành công tại EStore</p></div> ${listItems}`,
        attachments: attachImage

    })
};


module.exports = {
    sendEmailCreateOrder,
};
