import express from "express";
const router = express.Router();
import { body } from "express-validator";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/importImage.js";
import removeImg from "../middleware/removeImage.js";
import identifyUser from "../middleware/identifyUser.js";

// Functions imports
import {
  admin,
  create,
  save,
  addImage,
  saveImage,
  edit,
  changeStatus,
  remove,
  showProperty,
  sendMessage,
  showMessages,
  saveChanges,
} from "../controllers/propertyController.js";

// Routes
router.get("/properties", protectRoute, admin);

router.get("/admin/create", protectRoute, create);
router.post(
  "/admin/create",
  protectRoute,

  // Validations
  body("title").notEmpty().withMessage("Le titre ne peut pas être vide"),
  body("description")
    .notEmpty()
    .withMessage("La description ne peut pas être vide")
    .isLength({ max: 1000 })
    .withMessage("La description ne peut pas dépasser 1000 caractères"),
  body("category").isNumeric().withMessage("Sélectionnez une catégorie"),
  body("price").isNumeric().withMessage("Le prix ne peut pas être vide"),
  body("rooms").isNumeric().withMessage("Sélectionnez la quantité de chambres"),
  body("parking")
    .isNumeric()
    .withMessage("Sélectionnez la quantité de places de parking"),
  body("wc").isNumeric().withMessage("Sélectionnez la quantité de toilettes"),
  body("street").notEmpty().withMessage("L'adresse ne peut pas être vide"),
  save
);

router.get("/admin/add-image/:id", protectRoute, addImage);
router.post(
  "/admin/add-image/:id",
  protectRoute,
  upload.single("image"),
  saveImage
);

router.get("/admin/edit/:id", protectRoute, edit);
router.post(
  "/admin/edit/:id",
  protectRoute,

  // Validations
  body("title").notEmpty().withMessage("Le titre ne peut pas être vide"),
  body("description")
    .notEmpty()
    .withMessage("La description ne peut pas être vide")
    .isLength({ max: 1000 })
    .withMessage("La description ne peut pas dépasser 1000 caractères"),
  body("category").isNumeric().withMessage("Sélectionnez une catégorie"),
  body("price").isNumeric().withMessage("Le prix ne peut pas être vide"),
  body("rooms").isNumeric().withMessage("Sélectionnez la quantité de chambres"),
  body("parking")
    .isNumeric()
    .withMessage("Sélectionnez la quantité de places de parking"),
  body("wc").isNumeric().withMessage("Sélectionnez la quantité de toilettes"),
  body("street").notEmpty().withMessage("L'adresse ne peut pas être vide"),
  saveChanges
);

router.put("/admin/:id", protectRoute, changeStatus);
router.post("/admin/:id", protectRoute, removeImg, remove);

// Publique
router.get("/property/:id", identifyUser, showProperty);

// Messages
router.get("/messages/:id", protectRoute, showMessages);
router.post(
  "/messages/:id",
  identifyUser,
  body("message")
    .isLength({ min: 20 }, { max: 250 })
    .withMessage("Le message doit contenir entre 20 et 250 caractères"),
  sendMessage
);

export default router;
