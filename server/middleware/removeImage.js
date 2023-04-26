import { Property } from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const removeImg = async (req, res, next) => {
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

  // Supprimer l'image de cloundinary
  if (property.image) {
    const nameArr = property.image.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");

    cloudinary.uploader
      .destroy(`dropzone-images/${public_id}`, { resource_type: "image" })
      .then((result) => res.json({ result }));
    return next();
  }
  next();
};

export default removeImg;
