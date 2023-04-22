import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protectRoute = async (req, res, next) => {
  // Verifier si le token existe dans les cookies du frontend
  const authHeader = req.headers["authorization"];
  const _token = authHeader && authHeader.split(" ")[1];

  if (!_token) {
    return res.json({ redirect: "/auth/login" });
  }

  // Verifier si le token est valide
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    const user = await User.scope("deletePassword").findByPk(decoded.id);

    // Ajouter l'utilisateur à la requête
    if (user) {
      req.user = user;
    } else {
      return res.json({ redirect: "/auth/login" });
    }
    return next();
  } catch (error) {
    return res.json({ redirect: "/auth/login" });
  }

  next();
};

export default protectRoute;
