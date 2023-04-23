import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import propretyRoutes from "./routes/propertyRoutes.js";
import appRoutes from "./routes/appRoutes.js";

// Create app
const app = express();

// Form lecture
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

// Cookies
app.use(cookieParser());

// Cors config
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// Conection to database
try {
  await db.authenticate();
  await db.sync();
  console.log("Connexion réussi à la BD");
} catch (error) {
  console.error("Erreur lors de la connexion à la base de données :", error);
  process.exit(1);
}

// Routing
app.use("/", appRoutes);
app.use("/auth", userRoutes);
app.use("/", propretyRoutes);

// Set PORT and launch project
const port = 4000;
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port ${port}`);
});
