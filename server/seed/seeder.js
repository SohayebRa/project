import { exit } from "node:process";
import categories from "./categories.js";
import users from "./users.js";
import db from "../config/db.js";
import { Category, User } from "../models/index.js";

const importData = async () => {
  try {
    // S'authentifier
    await db.authenticate();
    console.log("Connexion réussi à la BD");

    // Synchroniser les modèles
    await db.sync();

    // Importer les données
    await Promise.all([
      Category.bulkCreate(categories),
      User.bulkCreate(users),
    ]);

    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const removeData = async () => {
  try {
    // Supprimer les données
    await db.sync({ force: true });
    console.log("Données supprimées avec succès");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
}

if (process.argv[2] === "-e") {
  removeData();
}
