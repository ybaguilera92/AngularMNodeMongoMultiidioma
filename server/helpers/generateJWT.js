import jwt from "jsonwebtoken";

const fn_JWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default fn_JWT;
