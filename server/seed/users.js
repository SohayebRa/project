import bcrypt from "bcrypt";

const users = [
  {
    name: "Sohayb",
    email: "sohayb@sohayb.com",
    confirmed: 1,
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "El TTKLK002",
    email: "elttklk002@gmail.com",
    confirmed: 1,
    password: bcrypt.hashSync("123456789", 10),
  },
];

export default users;
