const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
    return `<div>
    <h2>Your Recent Order for ${total}</h2>
    <p>Start heading on over, your order will be ready in the next 15 minutes!</p>
    <ul>
        ${order.map(item => 
            `<li>
            <img src="${item.thumbnail}" alt="${item.name}" />
            ${item.size} ${item.name} - ${item.price}
            </li>`
            ).join('')}
    </ul>
    <p>Your total is <strong>${total}</strong> due at pickup.</p>
    <style>
        ul {
            list-style: none;
        }
    </style>
    </div>
    `;
}

//create a transport for nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function wait(ms = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}

exports.handler = async (event, context) => {
    await wait(3000);
    //validate the data coming in
    const body = JSON.parse(event.body);
    //check if they filled out the honey pot
    if(body.mapleSyrup) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Boop Beep Bot, Good Bye ERR 12345` })
        }
    }

    const requiredFields = ['email', 'name', 'order'];
    
    for(const field of requiredFields) {
        if(!body[field]) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: `Oops, you are missing the ${field} field!` })
            }
        }
    }

    //make sure they order something
    if (!body.order.length) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `You forgot the most important part! The pizza!`})
        }
    }

    //send an email
    const info = await transporter.sendMail({
        from: "Slicks Slices <slick@example.com>",
        to: `${body.name} <${body.email}>, orders@example.com`,
        subject: "New Order!",
        html: generateOrderEmail({ order: body.order, total: body.total })
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success'})
    }
}