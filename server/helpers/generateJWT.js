import jwt from "jsonwebtoken";

const JWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default JWT;
