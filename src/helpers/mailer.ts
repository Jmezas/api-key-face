import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'groupmeza.25.11@gmail.com', // generated ethereal user
    pass: 'ckshbhacmrodckqq', // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
});
