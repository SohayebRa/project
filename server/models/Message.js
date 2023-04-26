import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Message = db.define("messages", {
  message: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  checked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Message;
