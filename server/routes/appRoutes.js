import express from "express";
const router = express.Router();
import identifyUser from "../middleware/identifyUser.js";

// Functions imports
import {
  home,
  filterCategory,
  filterPrice,
  category,
  search,
  profile,
  checked,
  deleteAccount,
} from "../controllers/appController.js";

// Routes
router.get("/", home);
router.post("/filter-category", filterCategory);
router.post("/filter-price", filterPrice);

router.get("/categories/:id", category);
router.post("/search", search);

router.get("/profile", identifyUser, profile);
router.post("/checked/:id", checked);
router.post("/delete-account/:id", deleteAccount);

export default router;
