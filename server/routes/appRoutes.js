import express from "express";
const router = express.Router();

// Functions imports
import {
  home,
  filterCategory,
  //   category,
  //   notFound,
  //   search,
} from "../controllers/appController.js";

// Routes
router.get("/", home);
router.post("/", filterCategory);

// router.get("/categories/:id", category);

// router.get("/404", notFound);

// router.post("/search", search);

export default router;
