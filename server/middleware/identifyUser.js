import jwt from "jsonwebtoken";
import User from "../models/User.js";

const identifyUser = async (req, res, next) => {
  // Verifier si le token existe dans les cookies du frontend
  const authHeader = req.headers["authorization"];
  const _token = authHeader && authHeader.split(" ")[1];

  if (!_token) {
    req.user = null;
    return next();
  }

  // Vérifier si le token est valide
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    // Masquer le mot de passe
    const user = await User.scope("deletePassword").findByPk(decoded.id);

    if (user) {
      req.user = user;
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.json({ token: "", redirect: "/auth/login" });
  }
};

export default identifyUser;
