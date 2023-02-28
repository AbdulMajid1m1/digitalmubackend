const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: async ({ from, to, subject, html }) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: "abdulmajid1m2@gmail.com",
        pass: "rkgttmnxstzarcmf",
      },
      port: 465,
      host: "smtp.gmail.com",
    });
    /* Send the email */
    let info = await transporter.sendMail(
      {
        from,
        to,
        subject,
        html,
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("emial sent");
        }
      }
    );

    /* Preview only available when sending through an Ethereal account */
    // console.log(`Message preview URL: ${nodemailer.getTestMessageUrl(info)}`)
  },
};

//rkgttmnxstzarcmf
