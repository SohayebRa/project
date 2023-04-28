import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateJWT, generateId } from "../helpers/tokens.js";
import { emailSignup, emailForgotPassword } from "../helpers/emails.js";

const formLogin = (req, res) => {
  res.json({
    page: "Connexion",
  });
};

const login = async (req, res) => {
  // Validation
  await check("email")
    .isEmail()
    .withMessage(
      "Veuillez saisir une adresse e-mail valide: 'example@email.com'"
    )
    .run(req);

  await check("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire")
    .run(req);

  let result = validationResult(req);

  // Verifier que result soit vide
  if (!result.isEmpty()) {
    // Erreurs
    return res.json({
      page: "Connexion",
      errors: result.array(),
    });
  }

  // Vérifier si l'utilisateur existe
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.json({
      page: "Connexion",
      errors: [{ msg: "Cette utilisateur n'existe pas" }],
    });
  }

  // Vérifier que c'est un utilisateur vérifié
  if (!user.confirmed) {
    return res.json({
      page: "Connexion",
      errors: [{ msg: "Votre compte n'est pas vérifié" }],
    });
  }

  // Vérifier le mot de passe
  if (!user.checkPassword(password)) {
    return res.json({
      page: "Connexion",
      errors: [{ msg: "Le mot de passe est incorrecte" }],
    });
  }

  // Authentifier l'utilisateur
  const token = generateJWT(user.id, user.name);

  // Stocker dans un cookie
  return res.json({
    cookieName: "_token",
    cookieValue: token,
    redirection: "/",
  });
};

const formSignup = (req, res) => {
  res.json({
    page: "Inscription",
  });
};

const signup = async (req, res) => {
  // Validations
  await check("name")
    .notEmpty()
    .withMessage("Le nom ne peut pas être vide")
    .run(req);

  await check("email")
    .isEmail()
    .withMessage(
      "Veuillez saisir une adresse e-mail valide: 'example@email.com'"
    )
    .run(req);

  await check("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit comporter au moins 8 caractères")
    .run(req);

  await check("confirm_password")
    .trim()
    .isLength({ min: 8 })
    .custom(async (confirm_password, { req }) => {
      const password = req.body.password;
      if (password !== confirm_password) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
    })
    .run(req);

  let result = validationResult(req);

  // Verifier que result soit vide
  if (!result.isEmpty()) {
    // Erreurs
    return res.json({
      page: "Inscription",
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  // Extraire les données
  const { name, email, password } = req.body;

  // Vérifier que l'utilisateur n'existe pas dejà
  const userAlreadyExist = await User.findOne({
    where: { email: email },
  });

  if (userAlreadyExist) {
    return res.json({
      page: "Inscription",
      errors: [{ msg: "Cet utilisateur existe déjà" }],
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  // Stocker l'utilisateur
  const user = await User.create({
    name,
    email,
    password,
    token: generateId(),
  });

  console.log(user.token);
  // Envoyer un e-mail de vérification
  emailSignup({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  // Afficher le message de vérification
  res.json({
    page: "Inscription",
    msg: "Compte créé avec succès. Nous avons envoyé un e-mail de vérification, cliquez sur le lien pour vérifier votre compte.",
  });
};

const confirm = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const { token } = req.params;
  console.log("Token Recuperation");

  // Vérifiez si le token est valide
  const user = await User.findOne({ where: { token } });
  console.log("Token Verification");

  if (!user || user.token === null) {
    return res.json({
      page: "Erreur lors de la vérification de votre compte",
      msg: "Une erreur s'est produite lors de la vérification de votre compte, veuillez réessayer",
      error: true,
    });
  }

  // Vérifier le compte si non confirmé
  user.token = null;
  user.confirmed = true;
  await user.save();

  return res.json({
    page: "Compte vérifié avec succès",
    msg: "Le compte a été vérifié avec succès",
    error: false,
    redirect: "/auth/login",
  });
};

const formForgotPassword = (req, res) => {
  res.json({
    page: "Réinitialisez votre mot de passe",
  });
};

const resetPassword = async (req, res) => {
  // Validations
  await check("email")
    .isEmail()
    .withMessage(
      "Veuillez saisir une adresse e-mail valide: 'example@email.com'"
    )
    .run(req);

  let result = validationResult(req);

  // Verifier que result soit vide
  if (!result.isEmpty()) {
    // Erreurs
    return res.json({
      page: "Réinitialisez votre mot de passe",
      errors: result.array(),
    });
  }

  // Trouver l'utilisateur
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.json({
      page: "Réinitialisez votre mot de passe",
      errors: [{ msg: "L'e-mail n'appartient à aucun utilisateur" }],
    });
  }

  // Générer un token et envoyer un e-mail
  user.token = generateId();
  await user.save();

  // Envoyer un mail
  emailForgotPassword({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  // Afficher un message
  res.json({
    page: "Réinitialisez votre mot de passe",
    msg: "Nous avons envoyé un e-mail avec les instructions",
  });
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token } });

  //auth/confirm
  if (!user && !user.token) {
    return res.json({
      page: "Réinitialisez votre mot de passe",
      msg: "Une erreur s'est produite lors de la validation de vos informations, veuillez réessayer",
      error: true,
    });
  }

  // Afficher le formulaire pour changer le mot de passe
  // auth/reset-password
  res.json({
    page: "Réinitialisez votre mot de passe",
  });
};

const newPassword = async (req, res) => {
  // Valider le password
  await check("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit comporter au moins 8 caractères")
    .run(req);

  let result = validationResult(req);

  // Verifier que result soit vide
  if (!result.isEmpty()) {
    // Erreurs
    return res.json({
      page: "Réinitialisez votre mot de passe",
      errors: result.array(),
    });
  }

  // Identifier qui fait le changement
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { token } });

  // Hasher le nouveau password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();
  res.json({
    page: "Réinitialisation de mot de passe réussi",
    msg: "Le mot de passe a été enregistré correctement",
  });
};

export {
  formLogin,
  login,
  formSignup,
  signup,
  confirm,
  formForgotPassword,
  resetPassword,
  checkToken,
  newPassword,
};
