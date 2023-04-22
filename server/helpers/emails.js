// Emails Helpers
import nodemailer from "nodemailer";

const emailSignup = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  // Envoyer un e-mail de vérification
  await transport.sendMail({
    from: "Estateowl.com",
    to: email,
    subject: "Vérifiez votre compte sur Estateowl.com",
    text: "Vérifiez votre compte sur Estateowl.com",

    html: `
        <p>Bonjour <b>${name}</b>, vérifiez votre compte sur Estateowl.com</p>

        <p>Votre compte est déjà prêt, vous n'avez plus qu'à le vérifiez dans le lien suivant : <a href='${process.env.CLIENT_URL}/auth/confirm/${token}'>Vérifier mon compte</a> </p>

        <p>Si vous n'avez pas créé ce compte, vous pouvez ignorer le message</p>
    `,
  });
};

const emailForgotPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  // Envoyer mail de réinitialisation de mp
  await transport.sendMail({
    from: "Estateowl.com",
    to: email,
    subject: "Réinitialisez votre mot de passe sur Estateowl.com",
    text: "Réinitialisez votre mot de passe sur Estateowl.com",

    html: `
        <p>Bonjour <b>${name}</b>, vous avez demandé la réinitialisation de votre mot de passe sur Estateowl.com</p>

        <p>Cliquez sur le lien ci-dessous pour générer un nouveau mot de passe : <a href='${process.env.CLIENT_URL}/auth/forgot-password/${token}'>Réinitialiser mon mot de passe</a>.</p>

        <p>Si vous n'avez pas demandé le changement de mot de passe, vous pouvez ignorer le message.</p>
    `,
  });
};

export { emailSignup, emailForgotPassword };
