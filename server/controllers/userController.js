import userSchema from "../models/userModel.js";
import JWT from "../helpers/generateJWT.js";
import generateSerial from "../helpers/generateSerial.js";
import {
  addLog
} from "./logController.js";
import addHistorial  from "./HistorialController.js";
import {
  getAll,
  getOne,
  deleteOne
} from "./handlerFactory.js";
import historialSchema from "../models/historialModel.js";


const signIn = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  const user = await userSchema.findOne({
    username
  });

  if (!user) {
    addLog(username, "Autentication", "Sign In", "User is not register!");
    return res.status(400).json({
      msg: `Username is not register!`
    });
  }
  if (!user.enabled) {
    addLog(username, "Autentication", "Sign In", "Your account is enabled!");
    return res.status(403).json({
      msg: "Your account is enabled!"
    });
  }

  if (await user.checkoutPassword(password)) {
    addLog(user, "Autentication", "Sign In", "A new sign!");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      lastName: user.lastName,
      token: JWT(user._id),
    });
  } else {
    addLog(username, "Autentication", "Sign In", "Password incorrect!");
    user.count = user.count + 1;
    await user.save();
    if (user.count == 2) { 
      user.enabled = false;
      user.count = 0;
      await user.save();
       return res.status(400).json({
         msg: "User disable!"
       });
    }
    return res.status(400).json({
      msg: "Password incorrect!"
    });
  }
};

const signOut = async (req, res) => {
  const {
    auth
  } = req.body;
  const {
    _res
  } = req.params;
  addLog(req, "Autentication", "Sign Out", _res !== "_" ? _res : "A new sign Out!");
  return res.json({
    msg: "Sign Out!"
  });
}

const addUser = async (req, res) => {
  const {
    email,
    username
  } = req.body;
  const issetUser = await userSchema.findOne({
    username
  });
  const issetEmail = await userSchema.findOne({
    email
  });

  if (issetEmail) {
    addLog(req, "Users", "Create", "User is register!");
    return res.status(400).json({
      msg: `This email is already registered!`
    });
  }
  if (issetUser) {
    addLog(req, "Users", "Create", "User is register!");
    return res.status(400).json({
      msg: `This username is already registered!`
    });
  }
  try {
    const user = new userSchema(req.body);

    user.token = generateSerial();
    
    await user.save();

    await addHistorial({
      user: user._id,
      password: user.password
    });

    //* send email
    /* email_create_account({
        email: user.email,
        name: user.name,
        token: user.token,
      });*/
    addLog(req, "Users", "Create", "A new user create!");
    res.json(user);
  } catch (err) {
    addLog(req, "Users", "Create", "Invalid token!");
    console.log(err);
  }
};
const register = async (req, res) => {
  const {
    email,
    username
  } = req.body;
  const issetUser = await userSchema.findOne({
    username
  });
  const issetEmail = await userSchema.findOne({
    email
  });

  if (issetEmail) {
    addLog(req, "Users", "Register", "User is register!");
    return res.status(400).json({
      msg: `This email is already registered!`
    });
  }
  if (issetUser) {
    addLog(req, "Users", "Register", "User is register!");
    return res.status(400).json({
      msg: `This username is already registered!`
    });
  }
  try {
    const user = new userSchema(req.body);
    user.token = generateSerial();
    user.role = "Other";
    await user.save();

    //* send email
    /* email_create_account({
        email: user.email,
        name: user.name,
        token: user.token,
      });*/
    addLog(req, "Users", "Register", "A new user register!");
    res.json(user);
  } catch (err) {
    addLog(req, "Users", "Register", "Invalid token!");
    console.log(err);
  }
};
const updateUser = async (req, res) => {
  const {
    _id
  } = req.params;

  try {
    const issetUser = await userSchema.findById(_id);
    if (!issetUser) {
      addLog(req, "Users", "Update", "In getting user!");
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
      addLog(req, "Users", "Update", "A new user update!") :
      addLog(req, "Users", "Change Password", "Changed password!");

  } catch (err) {
    addLog(req, "Users", "Update One", "Invalid token!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
}

const changePassword = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    passwordCurrent,
    passwordNew
  } = req.body;

  try {
    const userFind = await userSchema.findById({
      _id
    });

    if (!userFind) {
      addLog(req, "Users", "Change Password", "User not fount!");
      return res.json({
        msg: "User not fount!",
        error: true
      });
    }
    const historyPassword = await historialSchema.find({ user: _id}).sort({_id: -1}).limit(3)
    if (historyPassword.length) {
      for (let i = 0; i < historyPassword.length; i++) { 
        if (await historyPassword[i].existPassword(passwordNew)) {
               return res.status(400).json({
                 msg: "Password new exist!",
           });
        }
      }
    }
    if (!await userFind.checkoutPassword(passwordCurrent)) {
      addLog(req, "Users", "Change Password", "Current password not macth!");
      return res.status(400).json({
        msg: "Current password not macth!",
      });
    }
    userFind.password = passwordNew;
    userFind.save();
    addLog(req, "Users", "Change Password", "Changed password!");
    res.json({
      msg: "Successfully changed password!",
      error: false
    });

  } catch (err) {
    console.log(err);
    addLog(req, "Users", "Change Password", "Invalid token!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
};

const changeStatus = async (req, res) => {
  const {
    _id
  } = req.params;

  try {
    const userFind = await userSchema.findById({
      _id
    });

    if (!userFind) {
      addLog(req, "Users", "Change Status", "User not fount!");
      return res.json({
        msg: "User not fount!",
        error: true
      });
    }    
    userFind.enabled = !userFind.enabled;
    userFind.save();
    addLog(req, "Users", "Change Status", "Changed status!");
    res.json(userFind);

  } catch (err) {
    addLog(req, "Users", "Change Status", "Changed status!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
}
const deleteUser = async (req, res) => {
  const {
    _id
  } = req.params;

  try {
    const userFind = await userSchema.findById({
      _id
    });

    if (!userFind) {
      addLog(req, "Users", "Change Status", "User not fount!");
      return res.json({
        msg: "User not fount!",
        error: true
      });
    }
    userFind.deleteAt = true;
    userFind.save();
    addLog(req, "Users", "Delete User", "User deleted!");
    res.json(userFind);

  } catch (err) {
    addLog(req, "Users", "Delete User ", "Invalid token!");
    return res.status(404).json({
      msg: "Fatal error!"
    });
  }
}
const perfil = async (req, res) => {
  res.json(req.user)
};

const getUsers = getAll(userSchema);
const getUser = getOne(userSchema);
//const deleteUser = deleteOne(userSchema, "Users");


export {
  signIn,
  signOut,
  addUser,
  changePassword,
  updateUser,
  getUsers,
  getUser,
  deleteUser,
  changeStatus,
  perfil,
  register
};