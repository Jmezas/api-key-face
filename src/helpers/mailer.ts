import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'jmeza.mas@gmail.com', // generated ethereal user
    pass: 'uehfpfgtraggsnta', // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
});
