import jwt from "jsonwebtoken";
import shm_user from "../models/userModel.js";
import i18n from "../utils/i18.js";
// console.log(i18n.getLocales());
//console.log(i18n.setLocale('en')); // 'en'
const Auth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try {
      token = req.headers.authorization.split(" ")[1];
      (req.query.language) && i18n.setLocale(req.query.language)
      //console.log();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await shm_user
        .findById(decoded.id)
        .select("-password -enabled -token -createdAt -updatedAt -__v");

      return next();
    } catch (e) {
      res.status(401).json({ msg: "401 error!" });
    }
  }

  if (!token) {
    let e = new Error(`Token ${token} invalid!`);
    res.status(401).json({ msg: e.message });
    next();
  }

};

export default Auth;