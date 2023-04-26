import { Sequelize, Op } from "sequelize";
import { Property, Category, User, Message } from "../models/index.js";

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
    page: "Accueil: ",
    properties,
  });
};

const filterPrice = async (req, res) => {
  const { price } = req.body;
  console.log(price);

  let value;

  if (price && price.val2) {
    value = {
      [Sequelize.Op.between]: [price.val1, price.val2],
    };
  } else {
    value = {
      [Sequelize.Op.gte]: price.val1,
    };
  }

  const properties = await Property.findAll({
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
    where: {
      published: 1,
      price: value,
    },
    limit: 9,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    page: "Accueil: ",
    properties,
  });
};

const category = async (req, res) => {
  const { id } = req.params;

  const properties = await Property.findAll({
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
    where: {
      published: 1,
      categoryId: id,
    },
    order: [["createdAt", "DESC"]],
  });

  res.json({
    page: "Categories: ",
    properties,
  });
};

const search = async (req, res) => {
  const { term } = req.body;

  const properties = await Property.findAll({
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
    where: {
      published: 1,
      street: {
        [Op.like]: `%${term}%`,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  res.json({
    page: `Search results for "${term}":`,
    properties,
  });
};

const profile = async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  const properties = await Property.findAll({
    where: {
      userId: req.user.id,
    },
  });

  const newMessages = await Message.findAll({
    where: {
      propertyId: properties.map((property) => property.id),
      checked: false,
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "email"],
      },
    ],
  });

  const messages = newMessages.map((message) => ({
    id: message.id,
    message: message.message,
    checked: message.checked,
    createdAt: message.createdAt,
    propertyId: message.propertyId,
    userInfo: {
      id: message.user.dataValues.id,
      name: message.user.dataValues.name,
      email: message.user.dataValues.email,
    },
  }));

  res.json({
    page: "Mon Profile - " + user.name,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    messages,
  });
};

const checked = async (req, res) => {
  const { id } = req.params;

  const message = await Message.findOne({
    where: {
      id: id,
    },
  });

  message && (await message.update({ checked: true }));

  res.json({
    msg: id,
  });
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  const properties = await Property.findAll({
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
    where: {
      userId: id,
    },
  });

  const messages = await Message.findAll({
    where: {
      userId: id,
    },
  });

  user && (await user.destroy());
  properties &&
    properties.forEach(async (property) => {
      await property.destroy();
    });

  messages &&
    messages.forEach(async (message) => {
      await message.destroy();
    });

  res.json({
    msg: "Done",
    redirect: "/",
  });
};

export {
  home,
  filterCategory,
  filterPrice,
  category,
  search,
  profile,
  checked,
  deleteAccount,
};
