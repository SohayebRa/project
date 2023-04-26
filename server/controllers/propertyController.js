import { Category, Property, User, Message } from "../models/index.js";
import { validationResult } from "express-validator";

const admin = async (req, res) => {
  const currentPage = req.query.page;

  const regex = /^[0-9]$/;

  if (!regex.test(currentPage)) {
    return res.json({ redirect: "/properties?page=1" });
  }

  try {
    const { id } = req.user;

    const limit = 5;
    const offset = currentPage * limit - limit;

    const [properties, total] = await Promise.all([
      await Property.findAll({
        limit,
        offset,
        where: {
          userId: id,
        },
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: Message,
            as: "messages",
          },
        ],
      }),
      Property.count({
        where: {
          userId: id,
        },
      }),
    ]);

    // Je souhaite que certains info de chaque propriété soient affichées
    const arrayProperties = properties.map((property) => {
      const {
        id,
        title,
        description,
        price,
        categoryId,
        rooms,
        wc,
        parking,
        street,
        lat,
        lng,
        image,
        published,
      } = property;

      return {
        id,
        title,
        description,
        price,
        categoryId,
        rooms,
        wc,
        parking,
        street,
        lat,
        lng,
        image,
        published,
      };
    });

    res.json({
      page: "Mes propriétés",
      properties: arrayProperties,
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
  }
};

const create = (req, res) => {
  res.json({
    page: "Ajouter une propriété",
  });
};

const save = async (req, res) => {
  // Validation
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories] = await Promise.all([Category.findAll()]);

    return res.json({
      page: "Ajouter une propriété",
      categories,
      errors: result.array(),
      data: req.body,
    });
  }

  console.log(req.body);

  // Creez un record dans la table properties
  const {
    title,
    description,
    category: categoryId,
    price,
    rooms,
    wc,
    parking,
    street,
    lat,
    lng,
  } = req.body;

  const { id: userId } = req.user;

  try {
    const propertySaved = await Property.create({
      title,
      description,
      categoryId,
      price,
      rooms,
      wc,
      parking,
      street,
      lat,
      lng,
      userId,
      image: "",
    });

    const { id } = propertySaved;
    console.log(id);

    res.json({ id });
  } catch (error) {
    console.log(error);
  }
};

const addImage = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id);

  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété n'est pas publiée
  if (property.published) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (req.user.id.toString() !== property.userId.toString()) {
    return res.json({ redirect: "/properties" });
  }

  res.json({
    page: "Ajouter une image",
    property,
  });
};

const saveImage = async (req, res, next) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id);

  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété n'est pas publiée
  if (property.published) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (req.user.id.toString() !== property.userId.toString()) {
    return res.json({ redirect: "/properties" });
  }

  try {
    // Sauvegarder le lien de l'image dans la base de données
    property.image = req.file.path;
    property.published = 1;

    await property.save();
    next();
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id);
  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.json({ redirect: "/properties" });
  }

  res.json({
    page: `Modifier la propriété: ${property.title}`,
    property,
  });
};

const saveChanges = async (req, res) => {
  // Validation
  let result = validationResult(req);
  console.log(result);

  if (!result.isEmpty()) {
    res.json({
      page: "Modifier la propriété",
      errors: result.array(),
      data: req.body,
    });
  }

  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id);
  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.json({ redirect: "/properties" });
  }

  // Sauvegarder les modifications
  try {
    const {
      title,
      description,
      category,
      price,
      rooms,
      wc,
      parking,
      street,
      lat,
      lng,
    } = req.body;

    property.set({
      title,
      description,
      category,
      price,
      rooms,
      wc,
      parking,
      street,
      lat,
      lng,
    });

    await property.save();
    res.json({ redirect: "/properties" });
  } catch (error) {
    console.log(error);
  }
};

const changeStatus = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id);
  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.json({ redirect: "/properties" });
  }

  // Mettre a jour le status de la property
  property.published = !property.published;

  await property.save();
  res.json({
    property,
    result: "ok",
  });
};

const remove = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id);
  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.json({ redirect: "/properties" });
  }

  // Supprimer la property
  await property.destroy();
  res.json({
    property,
    result: "ok",
  });
};

const showProperty = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
  });

  let isSeller = false;

  // Verifier que l'utilisateur est connecté
  if (!req.user) {
    if (!property.published) {
      return res.json({ redirect: "/404" });
    }
  } else {
    // Verifier que la propriété appartient à l'utilisateur
    if (property.userId.toString() !== req.user.id.toString()) {
      // Vérifier que la propriété est publiée
      if (!property.published) {
        return res.json({ redirect: "/404" });
      }
    } else {
      isSeller = true;
    }
  }

  res.json({
    page: property.title,
    property,
    user: req.user,
    isSeller,
  });
};

const sendMessage = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
  });

  if (!property) {
    return res.json({ redirect: "/404" });
  }

  // Valider le formulaire
  let result = validationResult(req);

  let isSeller = false;

  if (req.user?.id === property.userId) {
    isSeller = true;
  } else {
    isSeller = false;
  }

  if (!result.isEmpty()) {
    return res.json({
      page: property.title,
      property,
      user: req.user,
      isSeller,
      errors: result.array(),
    });
  }

  // Enregistrer le message dans la base de données
  const { message } = req.body;
  const { id: propertyId } = req.params;
  const { id: userId } = req.user;

  await Message.create({
    message,
    checked: false,
    propertyId,
    userId,
  });

  res.json({
    page: property.title,
    property,
    user: req.user,
    isSeller,
    msg: "Message envoyé avec succès",
  });
};

const showMessages = async (req, res) => {
  const { id } = req.params;

  // Verifier que la propriété existe
  const property = await Property.findByPk(id, {
    include: [
      {
        model: Message,
        as: "messages",
        include: [{ model: User.scope("deletePassword"), as: "user" }],
      },
    ],
  });

  if (!property) {
    return res.json({ redirect: "/properties" });
  }

  // Verifier que la propriété appartient à l'utilisateur connecté
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.json({ redirect: "/properties" });
  }

  // Regrouper les messages par utilisateur
  const messagesByUser = [];

  property.messages.forEach((message) => {
    const user = message.user;
    const index = messagesByUser.findIndex((x) => x.id === user.id);

    if (index === -1) {
      messagesByUser.push({
        id: user.id,
        name: user.name,
        email: user.email,
        messages: [
          {
            id: message.id,
            message: message.message,
            createdAt: message.createdAt,
            propertyId: message.propertyId,
          },
        ],
      });
    } else {
      messagesByUser[index].messages.push({
        id: message.id,
        message: message.message,
        createdAt: message.createdAt,
        propertyId: message.propertyId,
      });
    }
  });

  messagesByUser.forEach((user) => {
    user.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });

  res.json({
    page: "Messages: " + property.title,
    messages: messagesByUser,
  });
};

export {
  admin,
  create,
  save,
  addImage,
  saveImage,
  edit,
  saveChanges,
  changeStatus,
  remove,
  showProperty,
  sendMessage,
  showMessages,
};
