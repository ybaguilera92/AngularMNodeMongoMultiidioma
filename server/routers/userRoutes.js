import express from "express";
import Auth from "../middleware/Auth.js";

import {
    signIn,
    signOut,
    addUser,
    changePassword,
    getUsers,
    getUser,
    deleteUser,
    changeStatus,
    perfil,
    register,
    updateUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", signIn);
router.post("/signOut/:_res", Auth, signOut);
router.post("/register", register);
router.post("/addUser", Auth, addUser);
router.get("/getUsers", getUsers);
router.put("/deleteUser/:_id", Auth, deleteUser);

router
    .route("/modify-user/:_id")
    .post(Auth, changePassword)
    .get(Auth, getUser)
    .put(Auth, updateUser)
    .patch(Auth, changeStatus)
    .delete(Auth, deleteUser);

router.get("/profile", Auth, perfil);

export default router;
