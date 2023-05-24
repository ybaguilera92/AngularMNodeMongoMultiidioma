import shm_user from "../models/userModel.js";
import fn_JWT from "../helpers/generateJWT.js";
import fn_generateSerial from "../helpers/generateSerial.js";
import {  logact} from "./logactController.js";
import { getAll, getOne, deleteOne } from "./handlerFactory.js";


const fn_signIn = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  const user = await shm_user.findOne({
    username
  });

  if (!user) {
    logact(username, "Autentication", "Sign In", "err: user is not register!");
    return res.status(400).json({
      msg: `Username is not register!`
    });
  }
  if (!user.enabled) {
    logact(username, "Autentication", "Sign In", "err: your account is enabled!");
    return res.status(403).json({
      msg: "Your account is enabled!"
    });
  }

  if (await user.checkoutPassword(password)) {
    logact(user, "Autentication", "Sign In", "succ: a new sign!");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      lastName: user.lastName,   
      token: fn_JWT(user._id),
    });
  } else {
    logact(username, "Autentication", "Sign In", "err: password incorrect!");
    return res.status(400).json({
      msg: "Password incorrect!"
    });
  }
};

const fn_signOut = async (req, res) => {
  const {
    auth
  } = req.body;
  const {
    _res
  } = req.params;

  logact(auth, "Autentication", "Sign Out", _res !== "_" ? _res : "succ: a new sign Out!");
  return res.json({
    msg: "Sign Out!"
  });
}

const fn_createOne = async (req, res) => {
  const {
    email,
    username
  } = req.body;
  const issetUser = await shm_user.findOne({
    username
  });
  const issetEmail = await shm_user.findOne({
    email
  });

  if (issetEmail) {
    logact(req, "Users", "Create One", "err: user is register!");
    return res.status(400).json({
      msg: `This email is already registered!`
    });
  }
  if (issetUser) {
    logact(req, "Users", "Create One", "err: user is register!");
    return res.status(400).json({
       msg: `This username is already registered!`
    });
  }
  try {
    const user = new shm_user(req.body);
    console.log(user);
    user.token = fn_generateSerial();

    await user.save();

    //* send email
    /* fn_email_create_account({
        email: user.email,
        name: user.name,
        token: user.token,
      });*/
    logact(req, "Users", "Create One", "succ: a new user create!");
    res.json(user);
  } catch (err) {
    logact(req, "Users", "Create One", "err: invalid token!");
    console.log(err);
  }
};
const fn_register = async (req, res) => {
  const {
    email,
    username
  } = req.body;
  const issetUser = await shm_user.findOne({
    username
  });
  const issetEmail = await shm_user.findOne({
    email
  });

  if (issetEmail) {
    logact(req, "Users", "Create One", "err: user is register!");
    return res.status(400).json({
      msg: `This email is already registered!`
    });
  }
  if (issetUser) {
    logact(req, "Users", "Create One", "err: user is register!");
    return res.status(400).json({
      msg: `This username is already registered!`
    });
  }
  try {
    const user = new shm_user(req.body); 
    user.token = fn_generateSerial();
    user.role = "Other";
    await user.save();

    //* send email
    /* fn_email_create_account({
        email: user.email,
        name: user.name,
        token: user.token,
      });*/
    logact(req, "Users", "Create One", "succ: a new user create!");
    res.json(user);
  } catch (err) {
    logact(req, "Users", "Create One", "err: invalid token!");
    console.log(err);
  }
};
const fn_updateOne = async (req, res) => {
  const {
    _id
  } = req.params;

  try {
    const issetUser = await shm_user.findById(_id);
    if (!issetUser) {
      logact(req, "Users", "Update One", "err: in getting user!");
      return res.status(404).json({
        msg: "Error getting user!"
      });
    }

    issetUser.name = req.body.name || issetUser.name;
    issetUser.lastName = req.body.lastName || issetUser.lastName;
    issetUser.email = req.body.email || issetUser.email;
    issetUser.password = req.body.password || issetUser.password;
    issetUser.role = req.body.role || issetUser.role;
    issetUser.enabled = req.body.enabled;

    const userStored = await issetUser.save();
    res.json(userStored);
    //console.log(issetUser)

    req.body.password?.length == 60 ?
      logact(req, "Users", "Update One", "succ: a new user update!") :
      logact(req, "Users", "Change Password", "succ: changed password!");

  } catch (err) {
    logact(req, "Users", "Update One", "err: invalid token!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
}

const fn_changePassword = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    passwordCurrent,
    passwordNew
  } = req.body;

  try {
    const userFind = await shm_user.findById({
      _id
    });

    if (!userFind) {
      logact(req, "Users", "Change Password", "err: user not fount!");
      return res.json({
        msg: "User not fount!",
        error: true
      });
    }
    if (!await userFind.checkoutPassword(passwordCurrent)) {
      logact(req, "Users", "Change Password", "err: current password not macth!");
      // return res.json({
      //   msg: "Current password not macth!",
      //   error: true
      // });
      return res.status(400).json({
        msg: "Current password not macth!",
      });
    }
    userFind.password = passwordNew;
    userFind.save();
    logact(req, "Users", "Change Password", "succ: changed password!");
    res.json({
      msg: "Successfully changed password!",
      error: false
    });

  } catch (err) {
    logact(req, "Users", "Change Password", "err: invalid token!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
};

const fn_changeStatus = async (req, res) => {
  const {
    _id
  } = req.params;

  try {
    const userFind = await shm_user.findById({
      _id
    });

    if (!userFind) {
      logact(req, "Users", "Change Status", "err: user not fount!");
      return res.json({
        msg: "User not fount!",
        error: true
      });
    }

    userFind.enabled = !userFind.enabled;
    userFind.save();
    logact(req, "Users", "Change Status", "succ: changed status!");
    res.json(userFind);

  } catch (err) {
    logact(req, "Users", "Change Status", "err: changed status!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
}

const fn_perfil = async (req, res) => {
  res.json(req.user)
};

const fn_getAll = getAll(shm_user);
const fn_getOne = getOne(shm_user);
const fn_deleteOne = deleteOne(shm_user, "Users");


export {
  fn_signIn,
  fn_signOut,
  fn_createOne,
  fn_changePassword,
  fn_updateOne,
  fn_getAll,
  fn_getOne,
  fn_deleteOne,
  fn_changeStatus,
  fn_perfil, fn_register
};