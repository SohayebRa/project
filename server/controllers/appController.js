import { Sequelize } from "sequelize";
import { Property, Category } from "../models/index.js";

const home = async (req, res) => {
  const properties = await Property.findAll({
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
    where: {
      published: 1,
    },
    limit: 6,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    page: "Accueil",
    properties,
  });
};

const filterCategory = async (req, res) => {
  const { category } = req.body;

  const properties = await Property.findAll({
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
    where: {
      published: 1,
      categoryId: category,
    },
    limit: 9,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    page: "Accueil: " + category.name,
    properties,
  });
};

export { home, filterCategory };
